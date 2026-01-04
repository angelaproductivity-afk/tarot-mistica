
import React, { useRef, useEffect, useState } from 'react';
import { GestureAnalyzer } from '../services/gestureService';
import { GestureState, HandData } from '../types';

interface HandTrackerProps {
  onHandUpdate: (data: HandData) => void;
  isMouseMode: boolean;
  resetTrigger?: number; // Optional prop to force a reset
}

const HandTracker: React.FC<HandTrackerProps> = ({ onHandUpdate, isMouseMode, resetTrigger }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef(new GestureAnalyzer());
  const lastUpdateRef = useRef<HandData | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentGestureName, setCurrentGestureName] = useState<string>("WAITING...");

  // Reset internal state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined) {
      analyzerRef.current.reset();
      const resetData = { x: 0.5, y: 0.5, gesture: GestureState.INITIAL, swayX: 0 };
      lastUpdateRef.current = resetData;
      onHandUpdate(resetData);
    }
  }, [resetTrigger, onHandUpdate]);

  useEffect(() => {
    if (isMouseMode) return;

    let handsInstance: any;
    let cameraInstance: any;

    const setupMediaPipe = async () => {
      try {
        const mpHands = await import('@mediapipe/hands');
        const mpCamera = await import('@mediapipe/camera_utils');
        const mpDrawing = await import('@mediapipe/drawing_utils');

        const Hands = mpHands.Hands || (mpHands as any).default?.Hands || (mpHands as any).default;
        const Camera = mpCamera.Camera || (mpCamera as any).default?.Camera || (mpCamera as any).default;
        const drawConnectors = mpDrawing.drawConnectors || (mpDrawing as any).default?.drawConnectors;
        const drawLandmarks = mpDrawing.drawLandmarks || (mpDrawing as any).default?.drawLandmarks;

        if (typeof Hands !== 'function') throw new Error("Hands constructor not found");

        handsInstance = new Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
        });

        handsInstance.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        handsInstance.onResults((results: any) => {
          const ctx = canvasRef.current?.getContext('2d');
          if (!ctx || !canvasRef.current) return;

          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            if (drawConnectors) {
                const connections = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
                drawConnectors(ctx, landmarks, connections, { color: '#00d4ff', lineWidth: 2 });
            }
            if (drawLandmarks) {
                drawLandmarks(ctx, landmarks, { color: '#d4af37', lineWidth: 1, radius: 2 });
            }

            const analysis = analyzerRef.current.analyze(landmarks);
            setCurrentGestureName(analysis.gesture);

            const last = lastUpdateRef.current;
            const posChanged = !last || Math.abs(last.x - analysis.x) > 0.003 || Math.abs(last.y - analysis.y) > 0.003;
            const gestureChanged = !last || last.gesture !== analysis.gesture;

            if (posChanged || gestureChanged) {
              const newData = {
                x: analysis.x,
                y: analysis.y,
                gesture: analysis.gesture,
                swayX: analysis.sway
              };
              lastUpdateRef.current = newData;
              onHandUpdate(newData);
            }
          } else {
            setCurrentGestureName("NO HAND");
          }
        });

        if (videoRef.current && Camera) {
          cameraInstance = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && handsInstance) {
                await handsInstance.send({ image: videoRef.current });
              }
            },
            width: 320,
            height: 240,
          });
          cameraInstance.start();
        }
      } catch (err: any) {
        console.error("Camera Setup Failed", err);
        setHasCamera(false);
        setErrorMsg(err.message || "Unknown Error");
      }
    };

    setupMediaPipe();

    return () => {
      if (cameraInstance) cameraInstance.stop();
      if (handsInstance) handsInstance.close();
    };
  }, [isMouseMode, onHandUpdate]);

  if (isMouseMode) return null;

  return (
    <div className="fixed top-4 right-4 w-[320px] h-[240px] rounded-xl overflow-hidden border-2 border-[#4b2c85] bg-black shadow-2xl z-50 opacity-80 pointer-events-none group">
      {!hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-gray-900 text-[10px] text-red-400 leading-tight">
          INITIALIZATION FAILED<br/>
          <span className="opacity-60">{errorMsg}</span>
        </div>
      )}
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" playsInline muted />
      <canvas ref={canvasRef} width={320} height={240} className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]" />
      
      {hasCamera && (
        <>
          <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[8px] text-white/50 font-mono tracking-tighter">
            LIVE FEED 320x240
          </div>
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            <div className="bg-cyan-500/20 backdrop-blur-sm px-2 py-1 rounded border border-cyan-400/30 text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
              {currentGestureName}
            </div>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[8px] text-green-500/80 uppercase font-bold tracking-widest">Active</span>
          </div>
        </>
      )}
    </div>
  );
};

export default HandTracker;
