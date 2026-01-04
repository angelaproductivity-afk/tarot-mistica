
import { GestureState } from '../types';

export class GestureAnalyzer {
  private lastIndexX: number | null = null;
  private swayVelocity: number = 0;
  private fistTimer: number = 0;
  private currentState: GestureState = GestureState.INITIAL;
  private gestureDebounceCounter: number = 0;
  private lastDetectedRawGesture: GestureState | null = null;

  reset(): void {
    this.currentState = GestureState.INITIAL;
    this.fistTimer = 0;
    this.swayVelocity = 0;
    this.gestureDebounceCounter = 0;
    this.lastDetectedRawGesture = GestureState.INITIAL;
  }

  analyze(landmarks: any[]): { gesture: GestureState; x: number; y: number; sway: number } {
    if (!landmarks || landmarks.length === 0) {
      return { gesture: this.currentState, x: 0.5, y: 0.5, sway: 0 };
    }

    const lm = landmarks;
    const wrist = lm[0];
    
    const dist = (p1: any, p2: any) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    const isFingerOpen = (tipIdx: number, baseIdx: number) => {
      return dist(lm[tipIdx], wrist) > dist(lm[baseIdx], wrist);
    };

    const indexOpen = isFingerOpen(8, 5);
    const middleOpen = isFingerOpen(12, 9);
    const ringOpen = isFingerOpen(16, 13);
    const pinkyOpen = isFingerOpen(20, 17);

    const isFist = !indexOpen && !middleOpen && !ringOpen && !pinkyOpen;
    const isPalm = indexOpen && middleOpen && ringOpen && pinkyOpen;
    const isPointing = indexOpen && !middleOpen && !ringOpen && !pinkyOpen;
    const isPeace = indexOpen && middleOpen && !ringOpen && !pinkyOpen;

    let rawGesture = this.currentState;

    // GLOBAL RESET: Peace or Fist always resets
    if (isPeace || isFist) {
      rawGesture = GestureState.INITIAL;
    } else if (isPalm) {
      // Transition to shuffle if we're not already drawing/revealing (or allow reshuffle)
      rawGesture = GestureState.SHUFFLE;
    } else if (isPointing) {
      if (this.currentState === GestureState.INITIAL || this.currentState === GestureState.SHUFFLE) {
        rawGesture = GestureState.DRAWING;
      } else if (this.currentState === GestureState.DRAWING) {
        if (this.lastIndexX !== null) {
          const deltaX = lm[8].x - this.lastIndexX;
          this.swayVelocity = this.swayVelocity * 0.8 + deltaX * 0.2;
          if (Math.abs(this.swayVelocity) > 0.015) { 
            rawGesture = GestureState.REVEALED;
          }
        }
      }
    }

    if (rawGesture !== this.lastDetectedRawGesture) {
      this.gestureDebounceCounter = 0;
      this.lastDetectedRawGesture = rawGesture;
    } else {
      this.gestureDebounceCounter++;
    }

    // Debounce to prevent flickering, but make INITIAL (reset) faster
    const threshold = rawGesture === GestureState.INITIAL ? 2 : 5;
    if (this.gestureDebounceCounter > threshold) {
      this.currentState = rawGesture;
    }

    this.lastIndexX = lm[8].x;

    return {
      gesture: this.currentState,
      x: 1 - lm[8].x,
      y: 1 - lm[8].y,
      sway: this.swayVelocity
    };
  }
}
