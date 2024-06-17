import { AbstractChannel } from './abstract-channel';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  protocol: 'chatV1'
};

export class ChatChannel extends AbstractChannel {

  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'chat', webrtcDataChannelConfiguration);
  }

}
