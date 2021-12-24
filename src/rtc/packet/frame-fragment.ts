import { LITTLE_ENDIAN } from '../common/constants';

export interface FrameFragment {
  frameId: number;
  timestamp: number;
  frameSize: number;
  offset: number;
  serverDataKey: number;
  isKeyFrame: number;
  data: Uint8Array;
}

export function parseFrameFragment(dataView: DataView, offset: number): FrameFragment {
  const frameId = dataView.getUint32(offset + 0, LITTLE_ENDIAN);
  const timestamp = dataView.getUint32(offset + 4, LITTLE_ENDIAN) / 10;
  const frameSize = dataView.getUint32(offset + 8, LITTLE_ENDIAN);
  const fragmentOffset = dataView.getUint32(offset + 12, LITTLE_ENDIAN);
  const serverDataKey = dataView.getUint32(offset + 16, LITTLE_ENDIAN);
  const isKeyFrame = dataView.getUint8(offset + 20);
  const data = new Uint8Array(dataView.buffer, offset + 21);

  return {
    frameId,
    timestamp,
    frameSize,
    offset: fragmentOffset,
    serverDataKey,
    isKeyFrame,
    data
  }
}

