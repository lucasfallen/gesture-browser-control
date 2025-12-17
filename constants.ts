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

// Detecção de superfície
export const SURFACE_WHITE_THRESHOLD = 200; // Valor RGB mínimo para considerar branco (0-255)
export const SURFACE_MIN_SIZE = 0.2; // 20% da imagem mínima para considerar válida
export const SURFACE_DETECTION_INTERVAL = 100; // ms entre detecções durante calibração

// Detecção de toque
export const TOUCH_Z_THRESHOLD = 0.1; // Coordenada Z máxima (normalizada) para considerar toque
export const TOUCH_VELOCITY_THRESHOLD = 0.02; // Velocidade vertical mínima (normalizada) para detectar movimento descendente
export const TOUCH_CONFIRMATION_FRAMES = 3; // Frames consecutivos necessários para confirmar toque

// Grid
export const GRID_MARGIN = 0.05; // Margem da grid (5% da tela em cada lado)