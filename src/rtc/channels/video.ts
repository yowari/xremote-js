import { AbstractChannel } from './abstract-channel';
import { FrameFragmentManager } from '../managers/frame-fragment-manager';
import { FrameMetadataManager } from '../managers/frame-metadata-manager';
import { parseFrameFragment } from '../packet/frame-fragment';
import { Frame } from '../common/interfaces';

const webrtcDataChannelConfiguration: RTCDataChannelInit = {
  id: 1,
  ordered: true,
  protocol: '1.0'
};

export class VideoFrameEvent extends Event {
  constructor(public frame: Frame) {
    super('frame');
  }
}

export class VideoChannel extends AbstractChannel {
  private frameFragmentManager = new FrameFragmentManager();

  constructor(webrtcClient: RTCPeerConnection, private frameMetadataManager: FrameMetadataManager) {
    super(webrtcClient, 'video', webrtcDataChannelConfiguration);
  }

  async onMessage(event: MessageEvent<ArrayBuffer>): Promise<void> {
    const dataView = new DataView(event.data);

    // parse frame fragment
    const frameFragment = parseFrameFragment(dataView, 0);

    // report a fragment of a frame has been received
    this.frameMetadataManager.reportFrameFragment(frameFragment);

    // push fragment and try to recontruct the frame
    const frame = this.frameFragmentManager.pushFragment(frameFragment);

    if (frame) {
      this.frameMetadataManager.reportRenderedFrame(frameFragment.frameId);
      this.dispatchEvent(new VideoFrameEvent(frame));
    }
  }
}
