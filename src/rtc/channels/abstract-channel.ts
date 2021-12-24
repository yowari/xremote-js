export class AbstractChannel extends EventTarget {
  protected webrtcDataChannel: RTCDataChannel;

  constructor(
    webrtcClient: RTCPeerConnection,
    public readonly label: string,
    webrtcDataChannelConfiguration: RTCDataChannelInit
  ) {
    super();
    this.webrtcDataChannel = webrtcClient.createDataChannel(label, webrtcDataChannelConfiguration);
    this.webrtcDataChannel.binaryType = 'arraybuffer';

    this.webrtcDataChannel.addEventListener('open', (event) => this.onOpen(event));
    this.webrtcDataChannel.addEventListener('message', (event) => this.onMessage(event));
    this.webrtcDataChannel.addEventListener('close', (event) => this.onClose(event));
    this.webrtcDataChannel.addEventListener('error', (error) => this.onError(error));
  }

  onOpen(event: Event): void {
    console.log(this.label + ' channel openned');
  }

  onMessage(event: Event): void {
    if (this.label !== 'video' && this.label !== 'audio') {
      console.log(this.label + ' channel received new message');
    }
  }

  onClose(event: Event): void {
    console.log(this.label + ' channel closed');
  }

  onError(error: Event): void {
    console.log(error);
  }
}
