import { FrameFragment } from '../packet/frame-fragment';
import { MetadataFrame } from '../packet/metadata-frame';

/**
 * Frame Metadata Manager responsible for logging and reporting frame time
 */
export class FrameMetadataManager {
  private frameMetadata: { [frameId: number]: MetadataFrame } = {};
  private renderedFrames: MetadataFrame[] = [];

  /**
   * report when a frame fragment has been received
   *
   * @param frameFragment the received frame fragment
   */
  reportFrameFragment(frameFragment: FrameFragment): void {
    if (!this.frameMetadata[frameFragment.frameId]) {
      const now = performance.now();

      this.frameMetadata[frameFragment.frameId] = {
        serverDataKey: frameFragment.serverDataKey,
        firstFramePacketArrivalTime: now,
        frameSubmittedTime: now,
        frameDecodedTime: now,
        frameRenderedTime: 0,
        framePacketTime: 0,
        frameDateNow: 0
      }
    }
  }

  /**
   * report when a frame has been rendered
   *
   * @param frameId the frame ID
   */
  reportRenderedFrame(frameId: number): void {
    this.frameMetadata[frameId].frameRenderedTime = performance.now();
    this.renderedFrames.push(this.frameMetadata[frameId]);
    delete this.frameMetadata[frameId];
  }

  /**
   * report when a frame is assembled
   */
  reportPacketTime(): void {
    const now = performance.now();

    for (const frameMetadata of this.renderedFrames) {
      frameMetadata.framePacketTime = now;
    }
  }

  /**
   * retrieve rendered frames
   *
   * @returns rendered frames
   */
  getRenderedFrames(): MetadataFrame[] {
    return this.renderedFrames;
  }

  /**
   * remove rendered frames from the frame list
   */
  clearRenderedFrame(): void {
    this.renderedFrames = [];
  }
}
