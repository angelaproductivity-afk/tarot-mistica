import React, { useState, useCallback, useEffect, useRef } from "react";
import Scene from "./components/Scene";
import HandTracker from "./components/HandTracker";
import Overlay from "./components/Overlay";
import { GestureState, HandData } from "./types";
import { TAROT_DECK } from "./constants";

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const App: React.FC = () => {
  const [handData, setHandData] = useState<HandData>({
    x: 0.5,
    y: 0.5,
    gesture: GestureState.INITIAL,
    swayX: 0,
  });

  const [isMouseMode, setIsMouseMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [forcedIndex, setForcedIndex] = useState<number | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const lastGestureRef = useRef<GestureState>(GestureState.INITIAL);

  // Keep indices valid if deck size changes (e.g., switching decks)
  useEffect(() => {
    const deckSize = TAROT_DECK.length;
    if (deckSize === 0) return;

    setSelectedIndex((prev) => clamp(prev, 0, deckSize - 1));
    setForcedIndex((prev) => (prev === null ? null : clamp(prev, 0, deckSize - 1)));
  }, [TAROT_DECK.length]);

  // Synchronize selection with hand movement during Drawing state (deck-length safe)
  useEffect(() => {
    const deckSize = TAROT_DECK.length;
    if (deckSize === 0) return;

    if (handData.gesture === GestureState.DRAWING) {
      if (forcedIndex !== null) {
        setSelectedIndex(clamp(forcedIndex, 0, deckSize - 1));
      } else {
        // Map X coordinate (0.1 to 0.9) to card index (0 to deckSize-1)
        const normalizedX = clamp(1 - handData.x, 0.1, 0.9);
        const index = Math.floor(((normalizedX - 0.1) / 0.8) * deckSize);
        setSelectedIndex(clamp(index, 0, deckSize - 1));
      }
    }
  }, [handData.x, handData.gesture, forcedIndex]);

  // Reset logic (unchanged behavior)
  useEffect(() => {
    if (handData.gesture === GestureState.INITIAL && lastGestureRef.current !== GestureState.INITIAL) {
      setResetTrigger((prev) => prev + 1);
      setForcedIndex(null);
    }
    lastGestureRef.current = handData.gesture;
  }, [handData.gesture]);

  // Keyboard controls (rewritten: hotkeys map to CARD IDs, not hardcoded indices)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const deckSize = TAROT_DECK.length;
      if (deckSize === 0) return;

      // 0-9 -> index (clamped to deck size)
      const num = Number(e.key);
      if (Number.isInteger(num) && num >= 0 && num <= 9) {
        setForcedIndex(Math.min(num, deckSize - 1));
        return;
      }

      // Hotkeys -> stable card IDs (safe even if you reorder)
      const hotkeyToId: Record<string, string> = {
        i: "ignis",
        a: "aqua",
        e: "aeris",
        t: "terra",
        n: "anima",
        o: "origo",
        p: "inno",
        g: "angelos",
        u: "umbra",
        s: "semina",
        c: "centrum",
      };

      const key = e.key.toLowerCase();
      const targetId = hotkeyToId[key];
      if (!targetId) return;

      const idx = TAROT_DECK.findIndex((card) => card.id === targetId);
      if (idx !== -1) setForcedIndex(idx);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleManualReset = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
    setHandData((prev) => ({ ...prev, gesture: GestureState.INITIAL }));
    setForcedIndex(null);
  }, []);

  const handleHandUpdate = useCallback((data: HandData) => {
    setHandData(data);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMouseMode) return;
      setHandData((prev) => ({
        ...prev,
        x: 1 - e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }));
    },
    [isMouseMode]
  );

  const handleMouseClick = useCallback(() => {
    if (!isMouseMode) return;
    setHandData((prev) => {
      let next = prev.gesture;
      if (prev.gesture === GestureState.INITIAL) next = GestureState.SHUFFLE;
      else if (prev.gesture === GestureState.SHUFFLE) next = GestureState.DRAWING;
      else if (prev.gesture === GestureState.DRAWING) next = GestureState.REVEALED;
      else if (prev.gesture === GestureState.REVEALED) next = GestureState.INITIAL;
      return { ...prev, gesture: next };
    });
  }, [isMouseMode]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden cursor-none bg-[#120124]"
      onMouseMove={handleMouseMove}
      onClick={handleMouseClick}
    >
      <Scene handData={handData} selectedIndex={selectedIndex} />

      <HandTracker onHandUpdate={handleHandUpdate} isMouseMode={isMouseMode} resetTrigger={resetTrigger} />

      <Overlay
        handData={handData}
        isMouseMode={isMouseMode}
        onToggleMode={() => setIsMouseMode(!isMouseMode)}
        selectedIndex={selectedIndex}
        forcedIndex={forcedIndex}
      />

      <div
        className="fixed pointer-events-none z-[100] w-10 h-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${(1 - handData.x) * 100}%`,
          top: `${(1 - handData.y) * 100}%`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="absolute inset-0 border border-gold/30 rounded-full animate-spin"></div>
        <div
          className={`w-2 h-2 rounded-full shadow-[0_0_15px_#00f2ff] transition-colors duration-500 ${
            handData.gesture === GestureState.DRAWING ? "bg-white" : "bg-gold"
          }`}
        />
      </div>
    </div>
  );
};

export default App;
