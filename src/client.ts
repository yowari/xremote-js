import { Console } from './api/models/console';
import { List } from './api/models/list';
import { Session } from './api/models/session';
import { getConsoles } from './api/rest/console';
import { getGSToken } from './api/rest/auth';
import * as sessionService from './api/rest/session';
import {
  AbstractChannel,
  AudioChannel,
  ChatChannel,
  ControlChannel,
  InputChannel,
  MessageChannel,
  VideoChannel
} from './rtc/channels';
import {
  FrameMetadataManager,
  GamepadManager
} from './rtc/managers';
import { execWithRetry } from './utils/task';
import { SessionStateType } from './api/models/session-state';
import { XboxError } from './api/models/error-details';
import { CorrelationVectorGenerator } from './utils/crypto';

export class ChannelToken<T> {
  constructor(public channelName: string) {}
}

export const VIDEO_CHANNEL = new ChannelToken<VideoChannel>('video');
export const AUDIO_CHANNEL = new ChannelToken<AudioChannel>('audio');
export const INPUT_CHANNEL = new ChannelToken<InputChannel>('input');
export const CONTROL_CHANNEL = new ChannelToken<ControlChannel>('control');
export const MESSAGE_CHANNEL = new ChannelToken<MessageChannel>('message');
export const CHAT_CHANNEL = new ChannelToken<ChatChannel>('chat');

export enum StreamState {
  InitSession,
  InitWebrtc,
  ConfigureSDP,
  ConfigureICE,
  Connected
}

export class AuthError extends Error {
  constructor() {
    super('Cannot execute an operation that needs client to be logged in');
  }
}

export class StreamStateChangeEvent extends Event {
  constructor(public state: StreamState) {
    super('streamstatechange');
  }
}

/**
 * Client class used to establish the connection and starts the game streaming.
 */
export class Client extends EventTarget {
  private webrtcClient?: RTCPeerConnection;
  private channels: { [channel: string]: AbstractChannel } = {};
  private frameMetadataManager = new FrameMetadataManager();
  private gamepadManager = new GamepadManager();
  private iceCandidates: RTCIceCandidate[] = [];
  private keepAliveIntervalId = 0;
  private cv = new CorrelationVectorGenerator();
  gstoken: string = '';

  /**
   * Create new Client instance to communicate with the console
   */
  constructor() {
    super();
  }

  /**
   * Authenticate using the OAuth token.
   *
   * @param token OAuth token
   */
  async login(oauthToken: string): Promise<void> {
    const token = await getGSToken(oauthToken);
    this.gstoken = token;
  }

  logout(): void {
    this.gstoken = '';
  }

  /**
   * Get the consoles associated with the account.
   *
   * @returns List of consoles
   */
  async getConsoles(): Promise<List<Console>> {
    this.checkAuth();
    return getConsoles(this.gstoken);
  }

  /**
   * Create a new game streaming session.
   *
   * @param serverId Console's server ID
   * @returns Session
   */
  async createSession(serverId: string): Promise<Session> {
    this.checkAuth();
    return sessionService.createSession(this.gstoken, serverId);
  }

  /**
   * Start stream and open streaming channels.
   *
   * Establish the WebRTC communication between the console and the browser.
   *
   * @param sessionId Session ID
   */
  async startStream(sessionId: string): Promise<void> {
    this.checkAuth();

    // starting stream
    this.dispatchEvent(new StreamStateChangeEvent(StreamState.InitSession));

    // wait for session to be ready
    const sessionState = await execWithRetry({
      task: () => sessionService.getSessionState(this.gstoken, sessionId),
      retries: 40,
      retryDelay: 1000,
      retryOn: (sessionState) => {
        switch (sessionState.state) {
          case SessionStateType.Provisioned:
          case SessionStateType.Failed:
            return false;
          default:
            return true;
        }
      }
    });

    if (sessionState.state === SessionStateType.Failed) {
      throw new XboxError(sessionState.errorDetails);
    }

    console.log(sessionState);

    // create Web RTC connection
    this.dispatchEvent(new StreamStateChangeEvent(StreamState.InitWebrtc));
    this.webrtcClient = new RTCPeerConnection();
    this.handleICEEvents(this.webrtcClient);
    this.openDataChannels(this.webrtcClient);

    this.webrtcClient.addEventListener('connectionstatechange', (event) => {
      console.log(event);
    });

    // create offer
    const offer = await this.webrtcClient.createOffer();
    console.log(offer);

    if (!offer.sdp) {
      throw new Error('Error in SDP offer');
    }

    await this.webrtcClient.setLocalDescription(offer);

    const sessionConfiguration = await sessionService.getSessionConfiguration(this.gstoken, sessionId);
    console.log(sessionConfiguration);

    // create SDP
    this.dispatchEvent(new StreamStateChangeEvent(StreamState.ConfigureSDP));
    await sessionService.sendSDP(this.gstoken, sessionId, offer.sdp);

    const sdpState = await execWithRetry({
      task: () => sessionService.getSDPState(this.gstoken, sessionId),
      retries: 5,
      retryDelay: 1000,
      retryOn: (response) => !response
    });
    console.log(sdpState);

    const sdpDetails = JSON.parse(sdpState.exchangeResponse);
    console.log(sdpDetails);

    await this.webrtcClient.setRemoteDescription({
      type: sdpDetails.sdpType,
      sdp: sdpDetails.sdp
    });

    // configure ICE
    this.dispatchEvent(new StreamStateChangeEvent(StreamState.ConfigureICE));
    console.log(this.iceCandidates[0].candidate);
    await sessionService.sendICE(this.gstoken, sessionId, this.iceCandidates[0].candidate);

    const iceState = await execWithRetry({
      task: () => sessionService.getICEState(this.gstoken, sessionId),
      retries: 5,
      retryDelay: 1000,
      retryOn: (response) => !response
    })
    console.log(iceState);

    const iceDetails = JSON.parse(iceState.exchangeResponse);
    console.log(iceDetails);

    for (const iceCandidate of iceDetails) {
      if (iceCandidate.candidate === 'a=end-of-candidates') {
        iceCandidate.candidate = ""; // TODO: Why?
        continue; // let avoid this one
      }

      this.webrtcClient.addIceCandidate({
        candidate: iceCandidate.candidate,
        sdpMid: iceCandidate.sdpMid,
        sdpMLineIndex: iceCandidate.sdpMLineIndex
      });
    }

    await sessionService.sendKeepAlive(this.gstoken, sessionId);
    this.keepAliveIntervalId = window.setInterval(() => {
      sessionService.sendKeepAlive(this.gstoken, sessionId);
    }, 60000);

    this.dispatchEvent(new StreamStateChangeEvent(StreamState.Connected));
  }

  /**
   * Stop stream and close all streaming channels
   */
  stopStream(): void {
    if (this.keepAliveIntervalId) {
      clearInterval(this.keepAliveIntervalId);
      this.keepAliveIntervalId = 0;
    }
    this.closeDataChannels();
    this.webrtcClient?.close();
  }

  /**
   * Get a streaming channel (audio, video, chat, etc.).
   *
   * @param channelToken Channel to retrieve
   * @returns Channel
   */
  getChannel<T extends AbstractChannel>(channelToken: ChannelToken<T>): T {
    return this.channels[channelToken.channelName] as T;
  }

  /**
   * Get the gamepad input manager.
   *
   * The gamepad manager is used to set input control (press/release buttons etc.)
   *
   * @returns Gamepad Manager
   */
  getGamepadManager(): GamepadManager {
    return this.gamepadManager;
  }

  private handleICEEvents(webrtcClient: RTCPeerConnection): void {
    webrtcClient.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        console.log('new ICE Candidate ', event);
        this.iceCandidates.push(event.candidate);
      }
    });

    webrtcClient.addEventListener('icegatheringstatechange', (event) => {
      if (webrtcClient.iceGatheringState === 'complete') {
        console.log('ICE candidates gathering completed ', event);
      }
    });

    webrtcClient.addEventListener('iceconnectionstatechange', () => {
      if (webrtcClient.iceConnectionState === 'connected') {
        console.log('ICE connected ');
      }
    });
  }

  private openDataChannels(webrtcClient: RTCPeerConnection): void {
    this.channels['video'] = new VideoChannel(webrtcClient, this.frameMetadataManager);
    this.channels['audio'] = new AudioChannel(webrtcClient);
    this.channels['input'] = new InputChannel(webrtcClient, this.frameMetadataManager, this.gamepadManager);
    this.channels['control'] = new ControlChannel(webrtcClient);
    this.channels['message'] = new MessageChannel(webrtcClient, this.cv);
    this.channels['chat'] = new ChatChannel(webrtcClient);
  }

  private checkAuth(): void {
    if (!this.gstoken) {
      throw new AuthError();
    }
  }

  private closeDataChannels(): void {
    this.channels = {};
  }
}
