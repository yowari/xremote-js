import { MetadataFrame } from '../packet/metadata-frame';

/**
 * Frame Metadata Manager responsible for logging and reporting frame time
 */
export class FrameMetadataManager {
  private renderedFrames: MetadataFrame[] = [];

  reportFrame(frame: MetadataFrame): void {
    this.renderedFrames.push(frame);
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
