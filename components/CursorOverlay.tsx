/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ScreenPoint, GestureType } from '../types';
import { CURSOR_COLORS } from '../constants';

interface CursorOverlayProps {
  position: ScreenPoint;
  isPinching: boolean;
  lastGesture: GestureType;
}

const CursorOverlay: React.FC<CursorOverlayProps> = ({ position, isPinching, lastGesture }) => {
  const getCursorColor = () => {
    if (lastGesture === GestureType.CLICK_LEFT) return CURSOR_COLORS.click;
    if (lastGesture === GestureType.CLICK_RIGHT) return CURSOR_COLORS.rightClick;
    if (isPinching) return CURSOR_COLORS.pinching;
    return CURSOR_COLORS.default;
  };

  const color = getCursorColor();

  return (
    <div 
      className="fixed pointer-events-none z-[9999] flex items-center justify-center"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.1s, height 0.1s' 
      }}
    >
      {/* Outer Ring */}
      <div 
        className="rounded-full border-2 transition-all duration-200"
        style={{
            borderColor: color,
            width: isPinching ? '40px' : '30px',
            height: isPinching ? '40px' : '30px',
            opacity: 0.6
        }}
      />
      
      {/* Inner Dot */}
      <div 
        className="rounded-full absolute transition-colors duration-100 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        style={{
            backgroundColor: color,
            width: '10px',
            height: '10px'
        }}
      />

      {/* Pulse Effect on Click */}
      {(lastGesture === GestureType.CLICK_LEFT || lastGesture === GestureType.CLICK_RIGHT) && (
          <div 
            className="absolute rounded-full animate-ping"
            style={{
                backgroundColor: color,
                width: '100%',
                height: '100%',
                opacity: 0.4
            }}
          />
      )}

      {/* Label for Action */}
      <div className="absolute top-8 whitespace-nowrap bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
         {lastGesture === GestureType.CLICK_LEFT && "Left Click"}
         {lastGesture === GestureType.CLICK_RIGHT && "Right Click"}
         {isPinching && lastGesture === GestureType.NONE && "Pinch..."}
      </div>
    </div>
  );
};

export default CursorOverlay;