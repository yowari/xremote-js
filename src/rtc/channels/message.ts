import { v4 as uuidv4 } from 'uuid';
import { AbstractChannel } from './abstract-channel';
import { CorrelationVectorGenerator } from '../../utils';
import { SystemUiType } from '../common/enums';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 5,
  protocol: 'messageV1'
};

export class MessageChannelEvent extends Event {
  constructor(public message: object) {
    super('message');
  }
}

export class MessageChannel extends AbstractChannel {
  private cv: CorrelationVectorGenerator;

  constructor(webrtcClient: RTCPeerConnection, cv: CorrelationVectorGenerator) {
    super(webrtcClient, 'message', webrtcDataChannelConfiguration);
    this.cv = cv.extend();
  }

  onOpen(event: Event): void {
    super.onOpen(event);

    this.sendHandshake();

    const configuration = {
      version: [0, 1, 0],
      systemUis: [
        SystemUiType.ShowVirtualKeyboard,
        SystemUiType.ShowMessageDialog,
        SystemUiType.ShowApplication,
        SystemUiType.ShowPurchase,
        SystemUiType.ShowTimerExtension
      ]
    };
    this.sendMessage('/streaming/systemUi/configuration', configuration);

    const clientAppInstall = {
      clientAppInstallId: uuidv4()
    };
    this.sendMessage('/streaming/properties/clientappinstallidchanged', clientAppInstall);

    const dimensions = {
      horizontal: 1920,
      vertical: 1080
    };
    this.sendMessage('/streaming/characteristics/dimensionschanged', dimensions);
  }

  onMessage(event: MessageEvent): void {
    super.onMessage(event);

    const messageText = event.data.replace(/\x00/g, '').trim();
    const message = JSON.parse(messageText);

    switch (message.type) {
      case 'HandshakeAck':
        console.log('Message channel ready');
        break;

      case 'Message':
        this.dispatchEvent(new MessageChannelEvent(message));
        break;

      case 'TransactionStart':
        this.dispatchEvent(new MessageChannelEvent(message));
        break;

      default:
        console.log(message);
        break;
    }
  }

  sendHandshake(): void {
    this.cv = this.cv.increment();

    const handshake = {
      type: 'Handshake',
      version: webrtcDataChannelConfiguration.protocol,
      id: uuidv4(),
      cv: this.cv.getValue()
    };

    this.webrtcDataChannel.send((new TextEncoder()).encode(JSON.stringify(handshake)));
  }

  sendMessage(target: string, content: object): void {
    this.cv = this.cv.increment();

    const message = {
      type: 'Message',
      content: JSON.stringify(content),
      id: uuidv4(),
      target,
      cv: this.cv.getValue(),
    };
    this.webrtcDataChannel.send((new TextEncoder()).encode(JSON.stringify(message)));
  }

  sendTransaction(target: string, content: object): void {
    this.cv = this.cv.increment();

    const message = {
      type: 'TransactionStart',
      content: JSON.stringify(content),
      id: uuidv4(),
      target,
      cv: this.cv.getValue(),
    };
    this.webrtcDataChannel.send((new TextEncoder()).encode(JSON.stringify(message)));
  }
}
