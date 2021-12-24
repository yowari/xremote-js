import { AbstractChannel } from './abstract-channel';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 6,
  protocol: 'chatV1'
};

export class ChatChannel extends AbstractChannel {

  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'chat', webrtcDataChannelConfiguration);
  }

}
