/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { useMediaPipe } from './hooks/useMediaPipe';
import WebcamPreview from './components/WebcamPreview';
import CursorOverlay from './components/CursorOverlay';
import { GestureType, ScreenPoint } from './types';
import { DOUBLE_CLICK_TIMEOUT } from './constants';
import { MousePointer2, Hand, Info, CheckCircle, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isCameraReady, handDataRef, lastResultsRef, error } = useMediaPipe(videoRef);

  // App State
  const [cursorPos, setCursorPos] = useState<ScreenPoint>({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [detectedGesture, setDetectedGesture] = useState<GestureType>(GestureType.NONE);
  
  // Feedback Log
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  // Gesture Logic Refs
  const wasPinchingRef = useRef(false);
  const pinchReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  // Main Logic Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      const data = handDataRef.current;
      
      // Update Cursor State UI
      setCursorPos(data.cursor);
      setIsPinching(data.isPinching);

      // --- Gesture Detection Engine ---
      
      // 1. Detect Pinch Release (Rising Edge)
      if (wasPinchingRef.current && !data.isPinching) {
          // User just released a pinch
          handlePinchRelease(data.cursor);
      }

      wasPinchingRef.current = data.isPinching;
      
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Handle Logic: Distinguish Single vs Double Click
  const handlePinchRelease = (pos: ScreenPoint) => {
      clickCountRef.current += 1;

      if (pinchReleaseTimerRef.current) {
          clearTimeout(pinchReleaseTimerRef.current);
      }

      // Wait a tiny bit to see if user pinches again
      pinchReleaseTimerRef.current = setTimeout(() => {
          if (clickCountRef.current === 1) {
              triggerClick(pos, 'left');
          } else if (clickCountRef.current >= 2) {
              triggerClick(pos, 'right');
          }
          clickCountRef.current = 0;
      }, DOUBLE_CLICK_TIMEOUT);
  };

  const triggerClick = (pos: ScreenPoint, type: 'left' | 'right') => {
      // Visual Feedback
      const gesture = type === 'left' ? GestureType.CLICK_LEFT : GestureType.CLICK_RIGHT;
      setDetectedGesture(gesture);
      setTimeout(() => setDetectedGesture(GestureType.NONE), 500);

      addLog(`${type === 'left' ? 'Left' : 'Right'} Click at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);

      // Interaction with DOM
      const element = document.elementFromPoint(pos.x, pos.y) as HTMLElement;
      if (element) {
          if (type === 'left') {
              element.click();
              // Add a ripple effect via code or just focus
              element.focus();
          } else {
              // Create a custom event for right click if elements listen to it
              // Or specifically for our test app, check a data attribute
              const event = new MouseEvent('contextmenu', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  clientX: pos.x,
                  clientY: pos.y
              });
              element.dispatchEvent(event);
          }
      }
  };

  // --- Test Area Handlers ---
  const [testBoxColor, setTestBoxColor] = useState('bg-white/10');
  const [testMessage, setTestMessage] = useState('Interaja aqui');

  const handleTestClick = () => {
      setTestBoxColor('bg-green-500/20');
      setTestMessage('Left Click Detectado!');
      setTimeout(() => {
          setTestBoxColor('bg-white/10');
          setTestMessage('Interaja aqui');
      }, 1000);
  };

  const handleTestContext = (e: React.MouseEvent) => {
      e.preventDefault();
      setTestBoxColor('bg-purple-500/20');
      setTestMessage('Right Click Detectado!');
      setTimeout(() => {
          setTestBoxColor('bg-white/10');
          setTestMessage('Interaja aqui');
      }, 1000);
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden font-sans text-slate-200 selection:bg-blue-500/30">
      
      {/* Hidden processing video */}
      <video 
        ref={videoRef} 
        className="absolute opacity-0 pointer-events-none"
        playsInline muted autoPlay
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6">
          
          {/* Header */}
          <div className="absolute top-8 text-center">
              <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
                  <MousePointer2 className="w-8 h-8 text-blue-400" />
                  Gesture Browser
              </h1>
              <p className="text-slate-400 text-sm">Controle o mouse via webcam</p>
          </div>

          {/* Setup / Loading State */}
          {!isCameraReady && (
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-8 rounded-2xl flex flex-col items-center animate-pulse">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Iniciando sistema de visão...</p>
                  {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
          )}

          {/* Main Interface Card (Only visible when ready) */}
          {isCameraReady && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                  
                  {/* Instructions Card */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-400" /> Comandos
                      </h2>
                      
                      <div className="space-y-6">
                          <div className="flex items-start gap-4">
                              <div className="bg-blue-500/20 p-3 rounded-xl">
                                  <Hand className="w-6 h-6 text-blue-400" />
                              </div>
                              <div>
                                  <h3 className="font-medium text-white">Mover Cursor</h3>
                                  <p className="text-sm text-slate-400 mt-1">Mova o dedo indicador livremente pela tela.</p>
                              </div>
                          </div>

                          <div className="flex items-start gap-4">
                              <div className="bg-green-500/20 p-3 rounded-xl">
                                  <CheckCircle className="w-6 h-6 text-green-400" />
                              </div>
                              <div>
                                  <h3 className="font-medium text-white">Clique Esquerdo</h3>
                                  <p className="text-sm text-slate-400 mt-1">Junte o indicador e o dedão <strong className="text-white">1x</strong> (Pinch).</p>
                              </div>
                          </div>

                          <div className="flex items-start gap-4">
                              <div className="bg-purple-500/20 p-3 rounded-xl">
                                  <AlertCircle className="w-6 h-6 text-purple-400" />
                              </div>
                              <div>
                                  <h3 className="font-medium text-white">Clique Direito</h3>
                                  <p className="text-sm text-slate-400 mt-1">Junte o indicador e o dedão <strong className="text-white">2x</strong> rapidamente.</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Testing Playground */}
                  <div className="flex flex-col gap-4">
                      <div 
                          className={`flex-1 ${testBoxColor} backdrop-blur-md border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center transition-all duration-300 group hover:border-blue-500/50 cursor-none`}
                      >
                          <button 
                              onClick={handleTestClick}
                              onContextMenu={handleTestContext}
                              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg transform transition-transform active:scale-95 pointer-events-auto"
                          >
                              {testMessage}
                          </button>
                      </div>

                      {/* Event Log */}
                      <div className="h-40 bg-black/40 rounded-2xl p-4 overflow-hidden font-mono text-xs border border-white/5">
                          <div className="text-slate-500 mb-2 uppercase tracking-wider text-[10px]">System Logs</div>
                          <div className="flex flex-col gap-1">
                              {logs.map((log, i) => (
                                  <div key={i} className="text-blue-300 opacity-80 border-l-2 border-blue-500 pl-2 animate-in slide-in-from-left-2">
                                      {log}
                                  </div>
                              ))}
                              {logs.length === 0 && <span className="text-slate-600 italic">Waiting for input...</span>}
                          </div>
                      </div>
                  </div>

              </div>
          )}
      </div>

      {/* Render Virtual Components */}
      {isCameraReady && (
        <>
            <WebcamPreview 
                videoRef={videoRef} 
                resultsRef={lastResultsRef} 
                isCameraReady={isCameraReady} 
            />
            <CursorOverlay 
                position={cursorPos} 
                isPinching={isPinching} 
                lastGesture={detectedGesture} 
            />
        </>
      )}
    </div>
  );
};

export default App;