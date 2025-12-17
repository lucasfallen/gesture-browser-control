/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum GestureType {
  NONE = 'NONE',
  MOVE = 'MOVE',
  PINCH_START = 'PINCH_START', // Holding pinch
  CLICK_LEFT = 'CLICK_LEFT',   // Released pinch 1x
  CLICK_RIGHT = 'CLICK_RIGHT'  // Released pinch 2x
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface HandData {
  cursor: ScreenPoint;
  isPinching: boolean;
  pinchDistance: number;
}