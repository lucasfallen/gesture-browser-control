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
  landmarks?: Array<{ x: number; y: number; z?: number }>; // Para acesso a coordenadas Z
  videoPosition?: ScreenPoint; // Posição normalizada no vídeo (0-1) para mapeamento de grid
}

// Calibração de Superfície
export interface BoundingBox {
  x: number; // Coordenada X normalizada (0-1)
  y: number; // Coordenada Y normalizada (0-1)
  width: number; // Largura normalizada (0-1)
  height: number; // Altura normalizada (0-1)
}

export interface GridBounds {
  surfaceBox: BoundingBox; // Bounding box na imagem da câmera
  screenBox: BoundingBox; // Bounding box na tela (pixels)
  aspectRatio: number; // Proporção largura/altura
}

export type CalibrationMode = 'normal' | 'calibrating' | 'grid';

export interface CalibrationState {
  mode: CalibrationMode;
  gridBounds: GridBounds | null;
  isActive: boolean;
}

export type TouchType = 'index' | 'middle' | null;