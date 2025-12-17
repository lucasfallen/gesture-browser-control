/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useRef, useCallback, useEffect } from 'react';
import { BoundingBox, GridBounds, CalibrationMode, ScreenPoint } from '../types';
import { 
  SURFACE_WHITE_THRESHOLD, 
  SURFACE_MIN_SIZE, 
  SURFACE_DETECTION_INTERVAL 
} from '../constants';

interface UseSurfaceCalibrationProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  getCurrentFrame: (() => HTMLCanvasElement | null) | null;
  isCameraReady: boolean;
}

interface UseSurfaceCalibrationReturn {
  isCalibrating: boolean;
  isGridMode: boolean;
  gridBounds: GridBounds | null;
  detectedSurface: BoundingBox | null;
  startCalibration: () => void;
  cancelCalibration: () => void;
  confirmCalibration: () => void;
  mapToGrid: (handPosition: ScreenPoint) => ScreenPoint | null;
  toggleGridMode: () => void;
  resetCalibration: () => void;
  updateGridBounds: (newGridBounds: GridBounds) => void;
}

export const useSurfaceCalibration = ({
  videoRef,
  getCurrentFrame,
  isCameraReady
}: UseSurfaceCalibrationProps): UseSurfaceCalibrationReturn => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isGridMode, setIsGridMode] = useState(false);
  const [gridBounds, setGridBounds] = useState<GridBounds | null>(null);
  const [detectedSurface, setDetectedSurface] = useState<BoundingBox | null>(null);
  
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect white surface in the video frame
  const detectSurface = useCallback((): BoundingBox | null => {
    if (!getCurrentFrame || !videoRef.current) return null;

    const canvas = getCurrentFrame();
    if (!canvas) return null;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Use luminance-based detection (more robust than RGB threshold)
    // Luminance = 0.299*R + 0.587*G + 0.114*B
    // Also check average RGB value for simplicity
    const mask: boolean[][] = [];
    let whitePixelCount = 0;
    
    for (let y = 0; y < height; y++) {
      mask[y] = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Calculate luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Calculate average RGB (simpler check)
        const avgRGB = (r + g + b) / 3;
        
        // Pixel is white/light if luminance OR average RGB is above threshold
        // This is more permissive and works better with different lighting conditions
        const isWhite = luminance >= SURFACE_WHITE_THRESHOLD || avgRGB >= SURFACE_WHITE_THRESHOLD;
        mask[y][x] = isWhite;
        if (isWhite) whitePixelCount++;
      }
    }

    // Debug: log white pixel percentage
    const whitePercentage = (whitePixelCount / (width * height)) * 100;
    console.log(`White pixels detected: ${whitePercentage.toFixed(1)}% (threshold: ${SURFACE_WHITE_THRESHOLD})`);

    // Find largest connected white region using flood fill
    const visited: boolean[][] = [];
    for (let y = 0; y < height; y++) {
      visited[y] = new Array(width).fill(false);
    }

    let largestArea = 0;
    let largestBox: BoundingBox | null = null;

    const floodFill = (startX: number, startY: number): { box: BoundingBox; area: number } | null => {
      if (startX < 0 || startX >= width || startY < 0 || startY >= height) return null;
      if (visited[startY][startX] || !mask[startY][startX]) return null;

      const stack: Array<[number, number]> = [[startX, startY]];
      let minX = startX, maxX = startX;
      let minY = startY, maxY = startY;
      let area = 0;

      while (stack.length > 0) {
        const [x, y] = stack.pop()!;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        if (visited[y][x] || !mask[y][x]) continue;

        visited[y][x] = true;
        area++;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);

        // Check 4-connected neighbors
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }

      // Normalize coordinates (0-1)
      const box: BoundingBox = {
        x: minX / width,
        y: minY / height,
        width: (maxX - minX) / width,
        height: (maxY - minY) / height
      };

      return { box, area };
    };

    // Find all connected components (sample every 10 pixels for better performance)
    const step = 10;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (!visited[y][x] && mask[y][x]) {
          const result = floodFill(x, y);
          if (result && result.area > largestArea) {
            largestArea = result.area;
            largestBox = result.box;
          }
        }
      }
    }

    // If flood fill didn't find a good region, try a simpler approach:
    // Find bounding box of all white pixels
    if (!largestBox || largestBox.width * largestBox.height < SURFACE_MIN_SIZE * 0.1) {
      let minX = width, maxX = 0, minY = height, maxY = 0;
      let foundWhite = false;
      let whitePixelsInSimple = 0;
      
      // Sample pixels (every 3 pixels for better coverage)
      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
          if (mask[y] && mask[y][x]) {
            foundWhite = true;
            whitePixelsInSimple++;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
      }
      
      if (foundWhite) {
        const boxWidth = (maxX - minX) / width;
        const boxHeight = (maxY - minY) / height;
        
        // Use a very lenient threshold for the simple method
        if (boxWidth > 0.03 && boxHeight > 0.03) { // At least 3% in each dimension
          // Add some padding to the detected box
          const padding = 0.02; // 2% padding
          largestBox = {
            x: Math.max(0, (minX / width) - padding),
            y: Math.max(0, (minY / height) - padding),
            width: Math.min(1, boxWidth + (padding * 2)),
            height: Math.min(1, boxHeight + (padding * 2))
          };
          console.log(`✓ Surface detected (simple method): ${(boxWidth * 100).toFixed(1)}% × ${(boxHeight * 100).toFixed(1)}% (${whitePixelsInSimple} pixels)`);
        } else {
          console.log(`⚠ Surface too small: ${(boxWidth * 100).toFixed(1)}% × ${(boxHeight * 100).toFixed(1)}%`);
        }
      }
    }

    // Validate minimum size (very lenient threshold - 1% of image)
    const minSizeThreshold = 0.01; // 1% of image (very lenient)
    if (largestBox && largestBox.width * largestBox.height >= minSizeThreshold) {
      const areaPercent = (largestBox.width * largestBox.height * 100).toFixed(1);
      console.log(`✓✓ Surface detected: ${(largestBox.width * 100).toFixed(1)}% × ${(largestBox.height * 100).toFixed(1)}% (area: ${areaPercent}%)`);
      return largestBox;
    }

    if (whitePixelCount > 0) {
      const areaPercent = largestBox ? (largestBox.width * largestBox.height * 100).toFixed(1) : '0';
      console.log(`⚠ White pixels found (${whitePixelCount}, ${whitePercentage.toFixed(1)}%) but area too small: ${areaPercent}% (min: ${(minSizeThreshold * 100).toFixed(1)}%)`);
    } else {
      console.log(`⚠ No white pixels detected. Threshold: ${SURFACE_WHITE_THRESHOLD}. Try: 1) Better lighting 2) Lower threshold 3) Closer to surface`);
    }

    return null;
  }, [getCurrentFrame, videoRef]);

  // Start calibration mode
  const startCalibration = useCallback(() => {
    if (!isCameraReady) return;
    
    setIsCalibrating(true);
    setIsGridMode(false);
    setDetectedSurface(null);

    // Start detection loop
    const detect = () => {
      const surface = detectSurface();
      if (surface) {
        setDetectedSurface(surface);
      }
    };

    detect(); // Initial detection
    detectionIntervalRef.current = setInterval(detect, SURFACE_DETECTION_INTERVAL);
  }, [isCameraReady, detectSurface]);

  // Cancel calibration
  const cancelCalibration = useCallback(() => {
    setIsCalibrating(false);
    setDetectedSurface(null);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  // Confirm calibration and create grid
  const confirmCalibration = useCallback(() => {
    if (!detectedSurface) return;

    const surfaceBox = detectedSurface;
    
    // Calculate screen bounds with margin
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const margin = 0.05; // 5% margin
    
    const screenBox: BoundingBox = {
      x: margin,
      y: margin,
      width: 1 - 2 * margin,
      height: 1 - 2 * margin
    };

    // Calculate aspect ratio
    const surfaceAspect = surfaceBox.width / surfaceBox.height;
    const screenAspect = screenBox.width / screenBox.height;
    
    // Adjust screen box to match surface aspect ratio
    let adjustedScreenBox = { ...screenBox };
    if (surfaceAspect > screenAspect) {
      // Surface is wider, adjust height
      const newHeight = screenBox.width / surfaceAspect;
      adjustedScreenBox.y = (1 - newHeight) / 2;
      adjustedScreenBox.height = newHeight;
    } else {
      // Surface is taller, adjust width
      const newWidth = screenBox.height * surfaceAspect;
      adjustedScreenBox.x = (1 - newWidth) / 2;
      adjustedScreenBox.width = newWidth;
    }

    const bounds: GridBounds = {
      surfaceBox,
      screenBox: adjustedScreenBox,
      aspectRatio: surfaceAspect
    };

    setGridBounds(bounds);
    setIsCalibrating(false);
    setIsGridMode(true);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, [detectedSurface]);

  // Map hand position from video coordinates to grid coordinates
  const mapToGrid = useCallback((videoPosition: ScreenPoint): ScreenPoint | null => {
    if (!gridBounds) return null;

    // videoPosition is normalized (0-1) in video space
    const { surfaceBox, screenBox } = gridBounds;
    
    // Check if position is within surface bounds
    const relativeX = (videoPosition.x - surfaceBox.x) / surfaceBox.width;
    const relativeY = (videoPosition.y - surfaceBox.y) / surfaceBox.height;
    
    if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) {
      return null; // Outside surface bounds
    }
    
    // Map to screen grid coordinates
    const screenX = screenBox.x * window.innerWidth + relativeX * screenBox.width * window.innerWidth;
    const screenY = screenBox.y * window.innerHeight + relativeY * screenBox.height * window.innerHeight;
    
    return { x: screenX, y: screenY };
  }, [gridBounds]);

  // Toggle grid mode on/off
  const toggleGridMode = useCallback(() => {
    if (gridBounds) {
      setIsGridMode(prev => !prev);
    }
  }, [gridBounds]);

  // Reset calibration
  const resetCalibration = useCallback(() => {
    setIsCalibrating(false);
    setIsGridMode(false);
    setGridBounds(null);
    setDetectedSurface(null);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  // Update grid bounds (for manual editing)
  // When user edits the grid on screen, recalculate the corresponding surface area in camera
  const updateGridBounds = useCallback((newGridBounds: GridBounds) => {
    if (!gridBounds) {
      setGridBounds(newGridBounds);
      return;
    }

    // Calculate the scale change in screenBox
    const oldScreenBox = gridBounds.screenBox;
    const newScreenBox = newGridBounds.screenBox;
    
    // Calculate scale factors
    const scaleX = newScreenBox.width / oldScreenBox.width;
    const scaleY = newScreenBox.height / oldScreenBox.height;
    
    // Calculate position offset (normalized)
    const offsetX = (newScreenBox.x - oldScreenBox.x) / oldScreenBox.width;
    const offsetY = (newScreenBox.y - oldScreenBox.y) / oldScreenBox.height;
    
    // Apply the same transformation to surfaceBox
    // This keeps the grid in camera synchronized with the grid on screen
    const oldSurfaceBox = gridBounds.surfaceBox;
    const newSurfaceBox: BoundingBox = {
      x: oldSurfaceBox.x + (offsetX * oldSurfaceBox.width),
      y: oldSurfaceBox.y + (offsetY * oldSurfaceBox.height),
      width: oldSurfaceBox.width * scaleX,
      height: oldSurfaceBox.height * scaleY
    };
    
    // Clamp to valid bounds (0-1)
    newSurfaceBox.x = Math.max(0, Math.min(1 - newSurfaceBox.width, newSurfaceBox.x));
    newSurfaceBox.y = Math.max(0, Math.min(1 - newSurfaceBox.height, newSurfaceBox.y));
    newSurfaceBox.width = Math.min(newSurfaceBox.width, 1 - newSurfaceBox.x);
    newSurfaceBox.height = Math.min(newSurfaceBox.height, 1 - newSurfaceBox.y);
    
    // Recalculate aspect ratio
    const newAspectRatio = newSurfaceBox.width / newSurfaceBox.height;
    
    const updatedGridBounds: GridBounds = {
      surfaceBox: newSurfaceBox,
      screenBox: newScreenBox,
      aspectRatio: newAspectRatio
    };
    
    setGridBounds(updatedGridBounds);
  }, [gridBounds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return {
    isCalibrating,
    isGridMode,
    gridBounds,
    detectedSurface,
    startCalibration,
    cancelCalibration,
    confirmCalibration,
    mapToGrid,
    toggleGridMode,
    resetCalibration,
    updateGridBounds
  };
};

