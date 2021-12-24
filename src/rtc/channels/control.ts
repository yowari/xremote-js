import { AbstractChannel } from './abstract-channel';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 4,
  protocol: 'controlV1'
};

export class ControlChannel extends AbstractChannel {

  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'control', webrtcDataChannelConfiguration);
  }

  onOpen(event: Event): void {
    super.onOpen(event);

    this.authRequest();
    this.configureControlBitrate();
    this.configureVideoBitrate();
    this.configureGamepad();
  }

  private authRequest(): void {
    const authRequest = JSON.stringify({
      "message":"authorizationRequest",
      "accessKey":"4BDB3609-C1F1-4195-9B37-FEFF45DA8B8E"
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(authRequest));
  }

  private configureControlBitrate(): void {
    const controlBitrate = JSON.stringify({
      "message":"rateControlBitrateUpdate",
      "bitratebps": 7500 * 1000 // min = 512, max = 12000, default = 5000 (value = * 1000)
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(controlBitrate));
  }

  private configureVideoBitrate(): void {
    const videoBitrate = JSON.stringify({
      "message":"videoChannelConfigUpdate",
      "maxVideoSctpMessageSizeBytes": 16000, // min = 512, max = 12000, default = 5000 (value = * 1000)
      "supportedFormats":[
        {"container":"mp4","codec":"avc","profile":2},
        {"container":"mp4","codec":"avc","profile":1}
      ]
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(videoBitrate));
  }

  private configureGamepad(): void {
    const gamepadChanged = JSON.stringify({
      "message": "gamepadChanged",
      "gamepadIndex": 0,
      "wasAdded": true
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(gamepadChanged));
  }
}
