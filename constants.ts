/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Thresholds for gesture detection
export const PINCH_THRESHOLD = 0.05; // Normalized distance between index and thumb
export const DOUBLE_CLICK_TIMEOUT = 300; // ms to wait for second pinch
export const MOVEMENT_SMOOTHING = 0.15; // 0 to 1, lower is smoother but more laggy

export const CURSOR_COLORS = {
  default: '#3b82f6',
  pinching: '#ef4444',
  click: '#22c55e',
  rightClick: '#a855f7'
};

export const COLORS = {
  left: '#ef4444',
  right: '#3b82f6'
};