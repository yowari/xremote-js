import { GamepadFrame } from '../packet/gamepad-frame';
import { Buttons } from '../common/enums';

/**
 * Gamepad class to interact and report joystick input change
 */
export class GamepadManager {
  private gamepads: GamepadFrame[] = [
    {
      gamepadIndex: 0,
      buttonMask: 0,
      leftThumbXAxis: 0,
      leftThumbYAxis: 0,
      rightThumbXAxis: 0,
      rightThumbYAxis: 0,
      leftTrigger: 0,
      rightTrigger: 0,
      physicalPhysicality: 0,
      virtualPhysicality: 0
    }
  ];
  gamepadStates = [this.gamepads[0]];

  pressButton(gamepadIndex: number, button: Buttons): void {
    if (!(this.gamepads[gamepadIndex].buttonMask & button)) {
      this.gamepads[gamepadIndex].buttonMask |= button;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  releaseButton(gamepadIndex: number, button: Buttons): void {
    if (this.gamepads[gamepadIndex].buttonMask & button) {
      this.gamepads[gamepadIndex].buttonMask &= (~button & 0xffff);
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  setLeftThumbX(gamepadIndex: number, value: number): void {
    if (this.gamepads[gamepadIndex].leftThumbXAxis !== value) {
      this.gamepads[gamepadIndex].leftThumbXAxis = value;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  setLeftThumbY(gamepadIndex: number, value: number): void {
    if (this.gamepads[gamepadIndex].leftThumbYAxis !== value) {
      this.gamepads[gamepadIndex].leftThumbYAxis = value;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  setRightThumbX(gamepadIndex: number, value: number): void {
    if (this.gamepads[gamepadIndex].rightThumbXAxis !== value) {
      this.gamepads[gamepadIndex].rightThumbXAxis = value;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  setRightThumbY(gamepadIndex: number, value: number): void {
    if (this.gamepads[gamepadIndex].rightThumbYAxis !== value) {
      this.gamepads[gamepadIndex].rightThumbYAxis = value;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  setLeftTrigger(gamepadIndex: number, value: number): void {
    if (this.gamepads[gamepadIndex].leftTrigger !== value) {
      this.gamepads[gamepadIndex].leftTrigger = value;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  setRightTrigger(gamepadIndex: number, value: number): void {
    if (this.gamepads[gamepadIndex].rightTrigger !== value) {
      this.gamepads[gamepadIndex].rightTrigger = value;
      this.pushState(this.gamepads[gamepadIndex]);
    }
  }

  clearGamepadStates(): void {
    this.gamepadStates = [];
  }

  pushState(gamepad: GamepadFrame): void {
    // TODO: for some reason this is not how it works
    // this.gamepadStates.push({ ...gamepad });
    this.gamepadStates = [gamepad];
  }
}
