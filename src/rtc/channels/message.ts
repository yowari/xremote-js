import { AbstractChannel } from './abstract-channel';

export class ReadyEvent extends Event {
  constructor() {
    super('messageready');
  }
}

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  protocol: 'messageV1'
};

export class MessageChannel extends AbstractChannel {
  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'message', webrtcDataChannelConfiguration);
  }

  onOpen(event: Event): void {
    super.onOpen(event);

    this.sendHandshake();
  }

  onMessage(event: Event): void {
    super.onMessage(event);

    const message = JSON.parse((event as any).data);

    if (message.type === 'HandshakeAck') {
      console.log(message);
      this.dispatchEvent(new ReadyEvent());
    }
  }

  private sendHandshake() {
    const handshake = JSON.stringify({
      'type':'Handshake',
      'version':'messageV1',
      'id':'f9c5f412-0e69-4ede-8e62-92c7f5358c56',
      'cv':'',
    });
    this.webrtcDataChannel.send((new TextEncoder()).encode(handshake));
  }
}
