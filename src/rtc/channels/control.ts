import { AbstractChannel } from './abstract-channel';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  protocol: 'controlV1'
};

export class ControlChannel extends AbstractChannel {

  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'control', webrtcDataChannelConfiguration);
  }

  onOpen(event: Event): void {
    super.onOpen(event);

    this.sendVideoChannelConfigUpdate();
  }

  onMessage(event: MessageEvent): void {
    super.onMessage(event);

    const message = JSON.parse(event.data);
    if (message.messageType === 'videoChannelConfig') {
      console.log(message);
    }
  }

  start(): void {
    this.sendAuthorizationRequest();
    this.senndGamepadChanged();
  }

  private sendAuthorizationRequest(): void {
    const authRequest = JSON.stringify({
      "message":"authorizationRequest",
      "accessKey":"4BDB3609-C1F1-4195-9B37-FEFF45DA8B8E"
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(authRequest));
  }

  private sendRateControlBitrateUpdate(): void {
    const controlBitrate = JSON.stringify({
      "message":"rateControlBitrateUpdate",
      "bitratebps": 7500 * 1000 // min = 512, max = 12000, default = 5000 (value = * 1000)
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(controlBitrate));
  }

  private sendVideoChannelConfigUpdate(): void {
    const videoBitrate = JSON.stringify({
      "message":"videoChannelConfigUpdate",
      "maxVideoSctpMessageSizeBytes": 16000, // min = 512, max = 12000, default = 5000 (value = * 1000)
      "supportedFormats":[
        {
          'container': 'mp4',
          'codec': 'avc',
          'profile': 2,
        },
        {
            'container': 'mp4',
            'codec': 'avc',
            'profile': 1,
        },
        {
          'container': 'annexb',
          'codec': 'avc',
          'profile': 1,
        },
      ]
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(videoBitrate));
  }

  private senndGamepadChanged(): void {
    const gamepadChanged = JSON.stringify({
      "message": "gamepadChanged",
      "gamepadIndex": 0,
      "wasAdded": true
    });

    this.webrtcDataChannel.send((new TextEncoder()).encode(gamepadChanged));
  }
}
