import { LITTLE_ENDIAN } from '../common/constants';

export const GAMEPAD_FRAME_SIZE = 23;

export interface GamepadFrame {
  gamepadIndex: number;
  buttonMask: number;
  leftThumbXAxis: number;
  leftThumbYAxis: number;
  rightThumbXAxis: number;
  rightThumbYAxis: number;
  leftTrigger: number;
  rightTrigger: number;
  physicalPhysicality: number;
  virtualPhysicality: number;
}

export function serializeGamepadFrame(dataView: DataView, offset: number, gamepadFrame: GamepadFrame): number {
  dataView.setUint8(offset + 0, gamepadFrame.gamepadIndex);
  dataView.setUint16(offset + 1, gamepadFrame.buttonMask, LITTLE_ENDIAN);
  dataView.setInt16(offset + 3, gamepadFrame.leftThumbXAxis, LITTLE_ENDIAN);
  dataView.setInt16(offset + 5, gamepadFrame.leftThumbYAxis, LITTLE_ENDIAN);
  dataView.setInt16(offset + 7, gamepadFrame.rightThumbXAxis, LITTLE_ENDIAN);
  dataView.setInt16(offset + 9, gamepadFrame.rightThumbYAxis, LITTLE_ENDIAN);
  dataView.setUint16(offset + 11, gamepadFrame.leftTrigger, LITTLE_ENDIAN);
  dataView.setUint16(offset + 13, gamepadFrame.rightTrigger, LITTLE_ENDIAN);
  dataView.setUint32(offset + 15, gamepadFrame.physicalPhysicality, LITTLE_ENDIAN);
  dataView.setUint32(offset + 19, gamepadFrame.virtualPhysicality, LITTLE_ENDIAN);

  return offset + GAMEPAD_FRAME_SIZE;
}
