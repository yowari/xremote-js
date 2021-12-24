import { AbstractChannel } from './abstract-channel';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 5,
  protocol: 'messageV1'
};

export class MessageChannel extends AbstractChannel {
  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'message', webrtcDataChannelConfiguration);
  }
}
