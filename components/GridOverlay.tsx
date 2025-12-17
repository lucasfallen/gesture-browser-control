/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GridBounds, BoundingBox } from '../types';
import { Move, Maximize2 } from 'lucide-react';

interface GridOverlayProps {
  gridBounds: GridBounds;
  isVisible: boolean;
  onGridChange?: (newGridBounds: GridBounds) => void;
  isEditing?: boolean;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;

const GridOverlay: React.FC<GridOverlayProps> = ({ 
  gridBounds, 
  isVisible, 
  onGridChange,
  isEditing = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { screenBox } = gridBounds;
  const left = screenBox.x * window.innerWidth;
  const top = screenBox.y * window.innerHeight;
  const width = screenBox.width * window.innerWidth;
  const height = screenBox.height * window.innerHeight;

  // Convert screen coordinates to normalized (0-1)
  const screenToNormalized = useCallback((screenX: number, screenY: number): BoundingBox => {
    return {
      x: screenX / window.innerWidth,
      y: screenY / window.innerHeight,
      width: width / window.innerWidth,
      height: height / window.innerHeight
    };
  }, [width, height]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - left,
      y: e.clientY - top
    });
  }, [isEditing, left, top]);

  // Handle mouse down for resizing
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width,
      height
    });
  }, [isEditing, width, height]);

  // Handle mouse move
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newLeft = e.clientX - dragStart.x;
        const newTop = e.clientY - dragStart.y;
        
        // Constrain to screen bounds
        const constrainedLeft = Math.max(0, Math.min(newLeft, window.innerWidth - width));
        const constrainedTop = Math.max(0, Math.min(newTop, window.innerHeight - height));

        const newScreenBox = screenToNormalized(constrainedLeft, constrainedTop);
        
        if (onGridChange) {
          onGridChange({
            ...gridBounds,
            screenBox: newScreenBox
          });
        }
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newLeft = left;
        let newTop = top;

        // Handle different resize directions
        if (isResizing.includes('e')) {
          newWidth = Math.max(100, Math.min(resizeStart.width + deltaX, window.innerWidth - left));
        }
        if (isResizing.includes('w')) {
          const maxWidth = left + resizeStart.width;
          newWidth = Math.max(100, Math.min(resizeStart.width - deltaX, maxWidth));
          newLeft = Math.max(0, left + deltaX);
        }
        if (isResizing.includes('s')) {
          newHeight = Math.max(100, Math.min(resizeStart.height + deltaY, window.innerHeight - top));
        }
        if (isResizing.includes('n')) {
          const maxHeight = top + resizeStart.height;
          newHeight = Math.max(100, Math.min(resizeStart.height - deltaY, maxHeight));
          newTop = Math.max(0, top + deltaY);
        }

        // Constrain to screen bounds
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - newWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - newHeight));
        newWidth = Math.min(newWidth, window.innerWidth - newLeft);
        newHeight = Math.min(newHeight, window.innerHeight - newTop);

        const newScreenBox: BoundingBox = {
          x: newLeft / window.innerWidth,
          y: newTop / window.innerHeight,
          width: newWidth / window.innerWidth,
          height: newHeight / window.innerHeight
        };

        if (onGridChange) {
          onGridChange({
            ...gridBounds,
            screenBox: newScreenBox
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, left, top, width, height, gridBounds, onGridChange, screenToNormalized]);

  if (!isVisible) return null;

  const resizeHandleSize = 12;
  const resizeHandleStyle = {
    width: `${resizeHandleSize}px`,
    height: `${resizeHandleSize}px`
  };

  return (
    <div
      ref={containerRef}
      className={`fixed z-[9998] border-2 ${isEditing ? 'border-blue-500 cursor-move' : 'border-dashed border-blue-500/50 pointer-events-none'} bg-blue-500/5`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <React.Fragment key={i}>
            {/* Vertical lines */}
            <div
              className="absolute top-0 bottom-0 border-l border-blue-500/30"
              style={{ left: `${((i + 1) / 5) * 100}%` }}
            />
            {/* Horizontal lines */}
            <div
              className="absolute left-0 right-0 border-t border-blue-500/30"
              style={{ top: `${((i + 1) / 5) * 100}%` }}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Corner markers / Resize handles */}
      {isEditing && (
        <>
          {/* Corner handles */}
          <div
            className="absolute bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              top: `-${resizeHandleSize / 2}px`,
              left: `-${resizeHandleSize / 2}px`
            }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              top: `-${resizeHandleSize / 2}px`,
              right: `-${resizeHandleSize / 2}px`
            }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              bottom: `-${resizeHandleSize / 2}px`,
              left: `-${resizeHandleSize / 2}px`
            }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              bottom: `-${resizeHandleSize / 2}px`,
              right: `-${resizeHandleSize / 2}px`
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* Edge handles */}
          <div
            className="absolute bg-blue-500/50 border border-white rounded-full cursor-ns-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              top: `-${resizeHandleSize / 2}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute bg-blue-500/50 border border-white rounded-full cursor-ns-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              bottom: `-${resizeHandleSize / 2}px`,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute bg-blue-500/50 border border-white rounded-full cursor-ew-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              left: `-${resizeHandleSize / 2}px`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute bg-blue-500/50 border border-white rounded-full cursor-ew-resize hover:bg-blue-400 transition-colors"
            style={{
              ...resizeHandleStyle,
              right: `-${resizeHandleSize / 2}px`,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}

      {/* Label */}
      <div className={`absolute top-2 left-2 bg-black/70 text-blue-300 text-xs px-2 py-1 rounded backdrop-blur-sm ${isEditing ? 'pointer-events-none' : ''}`}>
        {isEditing ? (
          <span className="flex items-center gap-1">
            <Move className="w-3 h-3" />
            Arraste para mover • Arraste cantos para redimensionar
          </span>
        ) : (
          'Área de Trabalho'
        )}
      </div>
    </div>
  );
};

export default GridOverlay;

