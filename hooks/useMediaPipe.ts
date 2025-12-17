/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { HandData } from '../types';
import { MOVEMENT_SMOOTHING, PINCH_THRESHOLD } from '../constants';

export const useMediaPipe = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store the latest processed hand data
  const handDataRef = useRef<HandData>({
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    isPinching: false,
    pinchDistance: 1
  });

  // Raw result for debugging/preview
  const lastResultsRef = useRef<HandLandmarkerResult | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);

  // Helper for linear interpolation
  const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

  // Calculate distance between two landmarks (normalized)
  const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  useEffect(() => {
    let isActive = true;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        
        if (!isActive) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1, // Only need one hand for cursor control
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        if (!isActive) {
             landmarker.close();
             return;
        }

        landmarkerRef.current = landmarker;
        startCamera();
      } catch (err: any) {
        console.error("Error initializing MediaPipe:", err);
        setError(`Failed to load tracking: ${err.message}`);
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });

        if (videoRef.current && isActive) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
             if (isActive) {
                 setIsCameraReady(true);
                 predictWebcam();
             }
          };
        }
      } catch (err) {
        console.error("Camera Error:", err);
        setError("Could not access camera.");
      }
    };

    const predictWebcam = () => {
        if (!videoRef.current || !landmarkerRef.current || !isActive) return;

        const video = videoRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
             let startTimeMs = performance.now();
             try {
                 const results = landmarkerRef.current.detectForVideo(video, startTimeMs);
                 lastResultsRef.current = results;
                 processResults(results);
             } catch (e) {
                 console.warn("Detection failed", e);
             }
        }
        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    const processResults = (results: HandLandmarkerResult) => {
        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0]; // Get first detected hand
            
            // Landmark 8 is Index Finger Tip
            const indexTip = landmarks[8];
            // Landmark 4 is Thumb Tip
            const thumbTip = landmarks[4];

            // 1. Calculate Cursor Position (Index Tip)
            // Mirror X because it's a webcam (move hand right -> cursor goes right)
            const targetX = (1 - indexTip.x) * window.innerWidth;
            const targetY = indexTip.y * window.innerHeight;

            // Smooth the movement
            const currentX = handDataRef.current.cursor.x;
            const currentY = handDataRef.current.cursor.y;

            const newX = lerp(currentX, targetX, MOVEMENT_SMOOTHING);
            const newY = lerp(currentY, targetY, MOVEMENT_SMOOTHING);

            // 2. Calculate Pinch
            const distance = getDistance(indexTip, thumbTip);
            const isPinching = distance < PINCH_THRESHOLD;

            handDataRef.current = {
                cursor: { x: newX, y: newY },
                isPinching,
                pinchDistance: distance
            };
        }
    };

    setupMediaPipe();

    return () => {
      isActive = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [videoRef]);

  return { isCameraReady, handDataRef, lastResultsRef, error };
};