import { LITTLE_ENDIAN } from '../common/constants';

export const METADATA_FRAME_SIZE = 28;

export interface MetadataFrame {
  serverDataKey: number;
  firstFramePacketArrivalTime: number;
  frameSubmittedTime: number;
  frameDecodedTime: number;
  frameRenderedTime: number;
  framePacketTime: number;
  frameDateNow: number;
}

export function serializeMetadataFrame(dataView: DataView, offset: number, frameMetadata: MetadataFrame): number {
  dataView.setUint32(offset + 0, frameMetadata.serverDataKey, LITTLE_ENDIAN);
  dataView.setUint32(offset + 4, frameMetadata.firstFramePacketArrivalTime * 10, LITTLE_ENDIAN);
  dataView.setUint32(offset + 8, frameMetadata.frameSubmittedTime * 10, LITTLE_ENDIAN);
  dataView.setUint32(offset + 12, frameMetadata.frameDecodedTime * 10, LITTLE_ENDIAN);
  dataView.setUint32(offset + 16, frameMetadata.frameRenderedTime * 10, LITTLE_ENDIAN);
  dataView.setUint32(offset + 20, frameMetadata.framePacketTime * 10, LITTLE_ENDIAN);
  dataView.setUint32(offset + 24, frameMetadata.frameDateNow * 10, LITTLE_ENDIAN);

  return offset + METADATA_FRAME_SIZE;
}
