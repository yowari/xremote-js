import { FrameFragment } from '../packet/frame-fragment';
import { Frame } from '../common/interfaces';

/**
 * Frame assembler
 */
export class FrameFragmentManager {
  private fragments: {
    [frameId: number]: {
      bytesReceived: number;
      data: Uint8Array;
      isKeyFrame: number;
    }
  } = {};

  /**
   * Add a fragment to the frame fragment processor in order to assemble the frame.
   *
   * @param fragment Frame fragment
   * @returns Frame when it can be assembled, null otherwise
   */
  pushFragment(fragment: FrameFragment): Frame | null {
    if (!this.fragments[fragment.frameId]) {
      this.fragments[fragment.frameId] = {
        bytesReceived: 0,
        data: new Uint8Array(fragment.frameSize),
        isKeyFrame: fragment.isKeyFrame
      }
    }

    this.fragments[fragment.frameId].data.set(fragment.data, fragment.offset);
    this.fragments[fragment.frameId].bytesReceived += fragment.data.byteLength;

    if (this.fragments[fragment.frameId].bytesReceived === fragment.frameSize) {
      const frameData = this.fragments[fragment.frameId].data;
      const isKeyFrame = this.fragments[fragment.frameId].isKeyFrame;
      delete this.fragments[fragment.frameId];
      return {
        data: frameData,
        isKeyFrame
      };
    } else {
      return null;
    }
  }
}
