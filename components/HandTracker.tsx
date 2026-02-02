import React, { useEffect, useRef, useState } from "react";
import { GestureAnalyzer } from "../services/gestureService";
import { GestureState, HandData } from "../types";

interface HandTrackerProps {
  onHandUpdate: (data: HandData) => void;
  isMouseMode: boolean;
  resetTrigger?: number;
}

const CAM_W = 320;
const CAM_H = 240;

const HandTracker: React.FC<HandTrackerProps> = ({
  onHandUpdate,
  isMouseMode,
  resetTrigger,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analyzerRef = useRef(new GestureAnalyzer());
  const lastUpdateRef = useRef<HandData | null>(null);

  const [hasCamera, setHasCamera] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentGestureName, setCurrentGestureName] = useState<string>("WAITING...");

  // Reset internal state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger === undefined) return;

    analyzerRef.current.reset();
    const resetData: HandData = {
      x: 0.5,
      y: 0.5,
      gesture: GestureState.INITIAL,
      swayX: 0,
    };
    lastUpdateRef.current = resetData;
    onHandUpdate(resetData);
  }, [resetTrigger, onHandUpdate]);

  useEffect(() => {
    if (isMouseMode) return;

    let handsInstance: any = null;
    let cameraInstance: any = null;
    let cancelled = false;

    const setup = async () => {
      try {
        setHasCamera(true);
        setErrorMsg(null);

        // IMPORTANT: no named imports, to avoid ESM export mismatch
        const mpHands = await import("@mediapipe/hands");
        const mpCamera = await import("@mediapipe/camera_utils");
        const mpDrawing = await import("@mediapipe/drawing_utils");

        const HandsCtor =
          (mpHands as any).Hands ||
          (mpHands as any).default?.Hands ||
          (mpHands as any).default;

        const CameraCtor =
          (mpCamera as any).Camera ||
          (mpCamera as any).default?.Camera ||
          (mpCamera as any).default;

        const drawConnectors =
          (mpDrawing as any).drawConnectors ||
          (mpDrawing as any).default?.drawConnectors;

        const drawLandmarks =
          (mpDrawing as any).drawLandmarks ||
          (mpDrawing as any).default?.drawLandmarks;

        if (typeof HandsCtor !== "function") throw new Error("MediaPipe Hands not available");
        if (typeof CameraCtor !== "function") throw new Error("MediaPipe Camera not available");

        handsInstance = new HandsCtor({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
        });

        handsInstance.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        handsInstance.onResults((results: any) => {
          if (cancelled) return;

          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (!canvas || !ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const hasHand =
            Array.isArray(results?.multiHandLandmarks) &&
            results.multiHandLandmarks.length > 0;

          if (!hasHand) {
            setCurrentGestureName("NO HAND");
            return;
          }

          const landmarks = results.multiHandLandmarks[0];

          if (drawConnectors) {
            const connections = [
              [0, 1],[1, 2],[2, 3],[3, 4],
              [0, 5],[5, 6],[6, 7],[7, 8],
              [5, 9],[9, 10],[10, 11],[11, 12],
              [9, 13],[13, 14],[14, 15],[15, 16],
              [13, 17],[17, 18],[18, 19],[19, 20],
              [0, 17],
            ];
            drawConnectors(ctx, landmarks, connections, { color: "#00d4ff", lineWidth: 2 });
          }

          if (drawLandmarks) {
            drawLandmarks(ctx, landmarks, { color: "#d4af37", lineWidth: 1, radius: 2 });
          }

          const analysis = analyzerRef.current.analyze(landmarks);
          setCurrentGestureName(analysis.gesture);

          const last = lastUpdateRef.current;
          const posChanged =
            !last ||
            Math.abs(last.x - analysis.x) > 0.003 ||
            Math.abs(last.y - analysis.y) > 0.003;

          const gestureChanged = !last || last.gesture !== analysis.gesture;

          if (posChanged || gestureChanged) {
            const nextData: HandData = {
              x: analysis.x,
              y: analysis.y,
              gesture: analysis.gesture,
              swayX: analysis.sway,
            };
            lastUpdateRef.current = nextData;
            onHandUpdate(nextData);
          }
        });

        const videoEl = videoRef.current;
        if (!videoEl) throw new Error("Video element not ready");

        cameraInstance = new CameraCtor(videoEl, {
          onFrame: async () => {
            if (!videoRef.current || !handsInstance) return;
            await handsInstance.send({ image: videoRef.current });
          },
          width: CAM_W,
          height: CAM_H,
        });

        await cameraInstance.start();
      } catch (err: any) {
        console.error("HandTracker setup failed:", err);
        if (cancelled) return;
        setHasCamera(false);
        setErrorMsg(err?.message || "Unknown error");
      }
    };

    setup();

    return () => {
      cancelled = true;
      try {
        cameraInstance?.stop?.();
      } catch {}
      try {
        handsInstance?.close?.();
      } catch {}
    };
  }, [isMouseMode, onHandUpdate]);

  if (isMouseMode) return null;

  return (
    <div
      className="
        fixed z-50 pointer-events-none group
        left-1/2 -translate-x-1/2 top-[96px]
        w-[70vw] max-w-[320px] aspect-[4/3] max-h-[22vh]
        rounded-2xl overflow-hidden border-2 border-[#4b2c85] bg-black shadow-2xl
        opacity-[0.85]

        md:left-auto md:translate-x-0 md:right-4
        md:top-[350px]
        md:w-[320px] md:h-[240px] md:aspect-auto md:max-h-none
        md:rounded-xl
      "
      aria-hidden="true"
    >
      {!hasCamera && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-gray-900 text-[10px] text-red-400 leading-tight">
          INITIALIZATION FAILED
          <br />
          <span className="opacity-60">{errorMsg}</span>
        </div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />

      <canvas
        ref={canvasRef}
        width={CAM_W}
        height={CAM_H}
        className="absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]"
      />

      {hasCamera && (
        <>
          <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[8px] text-white/60 font-mono tracking-tighter">
            LIVE FEED {CAM_W}x{CAM_H}
          </div>

          <div className="absolute bottom-2 left-2">
            <div className="bg-cyan-500/20 backdrop-blur-sm px-2 py-1 rounded border border-cyan-400/30 text-[10px] text-cyan-300 uppercase tracking-widest font-bold">
              {currentGestureName}
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] text-green-400/80 uppercase font-bold tracking-widest">
              Active
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default HandTracker;
