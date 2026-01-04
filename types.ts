
export enum GestureState {
  INITIAL = 'INITIAL',     // Fist: Stacked
  SHUFFLE = 'SHUFFLE',     // Open Palm: Scattering
  DRAWING = 'DRAWING',     // Index Finger: Selecting one
  REVEALED = 'REVEALED',   // Swaying Finger: Flipped
}

export interface TarotCardData {
  id: string;
  name: string;
  image: string;
  energy: string;
  meaning: string;
}

export interface HandData {
  x: number;
  y: number;
  gesture: GestureState;
  swayX: number;
}
