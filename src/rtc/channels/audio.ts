import { AbstractChannel } from './abstract-channel';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 2,
  maxRetransmits: 0,
  ordered: true,
  protocol: 'audioV1'
};

export class AudioChannel extends AbstractChannel {

  constructor(webrtcClient: RTCPeerConnection) {
    super(webrtcClient, 'audio', webrtcDataChannelConfiguration);
  }

}
