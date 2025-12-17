/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { GridBounds } from '../types';

interface GridOverlayProps {
  gridBounds: GridBounds;
  isVisible: boolean;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ gridBounds, isVisible }) => {
  if (!isVisible) return null;

  const { screenBox } = gridBounds;
  const left = screenBox.x * window.innerWidth;
  const top = screenBox.y * window.innerHeight;
  const width = screenBox.width * window.innerWidth;
  const height = screenBox.height * window.innerHeight;

  return (
    <div
      className="fixed pointer-events-none z-[9998] border-2 border-dashed border-blue-500/50 bg-blue-500/5"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      {/* Corner markers */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-blue-500 bg-blue-500/20 rounded-full" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-500 bg-blue-500/20 rounded-full" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-blue-500 bg-blue-500/20 rounded-full" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-blue-500 bg-blue-500/20 rounded-full" />
      
      {/* Label */}
      <div className="absolute top-2 left-2 bg-black/70 text-blue-300 text-xs px-2 py-1 rounded backdrop-blur-sm">
        Área de Trabalho
      </div>
    </div>
  );
};

export default GridOverlay;

