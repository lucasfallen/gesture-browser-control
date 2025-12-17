/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useRef, useCallback, useEffect } from 'react';
import { TouchType, HandData } from '../types';
import { TOUCH_Z_THRESHOLD, TOUCH_VELOCITY_THRESHOLD, TOUCH_CONFIRMATION_FRAMES } from '../constants';

interface UseTouchDetectionProps {
  handDataRef: React.MutableRefObject<HandData>;
  isGridMode: boolean;
}

interface UseTouchDetectionReturn {
  isTouching: boolean;
  touchType: TouchType;
}

export const useTouchDetection = ({
  handDataRef,
  isGridMode
}: UseTouchDetectionProps): UseTouchDetectionReturn => {
  const [isTouching, setIsTouching] = useState(false);
  const [touchType, setTouchType] = useState<TouchType>(null);
  
  const lastZRef = useRef<{ index: number; middle: number } | null>(null);
  const velocityRef = useRef<{ index: number; middle: number }>({ index: 0, middle: 0 });
  const confirmationFramesRef = useRef<{ index: number; middle: number }>({ index: 0, middle: 0 });
  const wasTouchingRef = useRef(false);

  // Detect touch based on Z coordinate and velocity
  useEffect(() => {
    if (!isGridMode) {
      setIsTouching(false);
      setTouchType(null);
      return;
    }

    let animationFrameId: number;

    const detectTouch = () => {
      const handData = handDataRef.current;
      const landmarks = handData.landmarks;

      if (!landmarks || landmarks.length < 13) {
        // Need at least landmarks 8 (index) and 12 (middle)
        setIsTouching(false);
        setTouchType(null);
        animationFrameId = requestAnimationFrame(detectTouch);
        return;
      }

      // Landmark 8 is Index Finger Tip
      const indexTip = landmarks[8];
      // Landmark 12 is Middle Finger Tip
      const middleTip = landmarks[12];

      if (!indexTip || !middleTip || indexTip.z === undefined || middleTip.z === undefined) {
        setIsTouching(false);
        setTouchType(null);
        animationFrameId = requestAnimationFrame(detectTouch);
        return;
      }

      const indexZ = Math.abs(indexTip.z);
      const middleZ = Math.abs(middleTip.z);

      // Calculate velocity (change in Z)
      if (lastZRef.current) {
        velocityRef.current.index = Math.abs(indexZ - lastZRef.current.index);
        velocityRef.current.middle = Math.abs(middleZ - lastZRef.current.middle);
      }
      lastZRef.current = { index: indexZ, middle: middleZ };

      // Check for index finger touch
      const isIndexTouching = indexZ < TOUCH_Z_THRESHOLD && 
                              velocityRef.current.index > TOUCH_VELOCITY_THRESHOLD;
      
      // Check for middle finger touch
      const isMiddleTouching = middleZ < TOUCH_Z_THRESHOLD && 
                               velocityRef.current.middle > TOUCH_VELOCITY_THRESHOLD;

      // Require confirmation frames to avoid false positives
      let detectedTouch: TouchType = null;
      
      if (isIndexTouching) {
        confirmationFramesRef.current.index++;
        if (confirmationFramesRef.current.index >= TOUCH_CONFIRMATION_FRAMES) {
          detectedTouch = 'index';
          confirmationFramesRef.current.index = 0; // Reset
        }
      } else {
        confirmationFramesRef.current.index = 0;
      }

      if (isMiddleTouching && !detectedTouch) {
        confirmationFramesRef.current.middle++;
        if (confirmationFramesRef.current.middle >= TOUCH_CONFIRMATION_FRAMES) {
          detectedTouch = 'middle';
          confirmationFramesRef.current.middle = 0; // Reset
        }
      } else {
        confirmationFramesRef.current.middle = 0;
      }

      // Update touch state
      if (detectedTouch) {
        setIsTouching(true);
        setTouchType(detectedTouch);
        wasTouchingRef.current = true;
      } else if (!isIndexTouching && !isMiddleTouching) {
        // Reset touch state when fingers are lifted
        if (wasTouchingRef.current) {
          setIsTouching(false);
          setTouchType(null);
          wasTouchingRef.current = false;
        }
      }

      animationFrameId = requestAnimationFrame(detectTouch);
    };

    detectTouch();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isGridMode, handDataRef]);

  return {
    isTouching,
    touchType
  };
};

