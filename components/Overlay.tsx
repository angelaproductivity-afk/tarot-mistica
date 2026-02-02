import React from "react";
import { GestureState, HandData } from "../types";
import { TAROT_DECK } from "../constants";

interface OverlayProps {
  handData: HandData;
  isMouseMode: boolean;
  onToggleMode: () => void;
  selectedIndex: number;
  forcedIndex: number | null;
}

const Overlay: React.FC<OverlayProps> = ({
  handData,
  isMouseMode,
  onToggleMode,
  selectedIndex,
  forcedIndex,
}) => {
  const selectedCard = TAROT_DECK[selectedIndex];

  const getStatusText = () => {
    switch (handData.gesture) {
      case GestureState.INITIAL:
        return "Respira profundo y conecta con tu guía interior";
      case GestureState.SHUFFLE:
        return "Haz tu pregunta y deja fluir la energía";
      case GestureState.DRAWING:
        return "Sigue tu intuición y elige tu carta";
      case GestureState.REVEALED:
        return "Muévete suavemente para recibir el mensaje";
      default:
        return "El universo está alineándose...";
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-12 z-40 overflow-hidden select-none">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="group">
          <h1 className="text-2xl sm:text-4xl font-cinzel text-gold tracking-[0.28em] sm:tracking-[0.3em] drop-shadow-2xl uppercase">
            Taromistica
          </h1>
          <div className="h-[1px] w-0 bg-gold group-hover:w-full transition-all duration-1000 opacity-30 mt-1" />
          <p className="text-[8px] sm:text-[9px] text-cyan-300 font-light tracking-[0.55em] sm:tracking-[0.6em] uppercase mt-2 sm:mt-3 opacity-40">
            Sistema de Adivinación Digital v2.5
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <button
            onClick={onToggleMode}
            className="px-4 sm:px-6 py-2 border border-gold/20 bg-black/20 text-gold/80 font-cinzel text-[9px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.3em] hover:bg-gold/10 hover:border-gold/50 transition-all duration-700 pointer-events-auto backdrop-blur-sm rounded-sm"
          >
            {isMouseMode ? "MODO CLIC" : "ENTRADA SENSORIAL"}
          </button>

          {forcedIndex !== null && (
            <div className="text-[8px] text-gold-100 uppercase tracking-widest animate-pulse font-medium bg-gold/5 px-3 py-1 border border-gold/10">
              Patrón fijado: {TAROT_DECK[forcedIndex]?.name}
            </div>
          )}
        </div>
      </div>

      {/* Reveal Panel */}
      {handData.gesture === GestureState.REVEALED && (
        <div
          className="
            absolute
            left-1/2 -translate-x-1/2
            bottom-[150px]
            w-[92vw] max-w-[560px]

            sm:left-16 sm:top-[42%] sm:bottom-auto
            sm:w-auto sm:max-w-md
            sm:-translate-x-0 sm:-translate-y-1/2
            max-[420px]:bottom-[180px]
          "
        >
          <div className="bg-black/40 backdrop-blur-3xl p-5 sm:p-10 border-l-[1px] border-gold/40 shadow-2xl animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-left-12 duration-1000">
            <div className="text-gold/40 text-[9px] tracking-[0.35em] font-bold mb-2 uppercase">
              Señal detectada
            </div>

            <h2 className="text-3xl sm:text-5xl font-cinzel text-gold mb-2 sm:mb-3 tracking-wider leading-none">
              {selectedCard.name}
            </h2>

            {selectedCard.energy && (
              <div className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/55 font-light mb-3 sm:mb-4 leading-snug">
                {selectedCard.energy}
              </div>
            )}

            <div className="w-10 h-[1px] bg-gold/20 mb-3 sm:mb-4" />

            <div className="max-h-[30vh] sm:max-h-none overflow-auto pr-1">
              <p className="text-[15px] sm:text-xl text-white/80 font-light leading-snug sm:leading-relaxed font-serif italic">
                {selectedCard.meaning}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Instructions */}
      <div className="flex flex-col items-center gap-5 sm:gap-8 mb-4 sm:mb-4">
        <div className="group relative">
          <div className="absolute -inset-4 bg-gold/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative px-6 sm:px-16 py-3 sm:py-4 bg-black/20 backdrop-blur-md rounded-full border border-white/5 text-center transition-all duration-700 hover:border-gold/30">
            <span className="text-[9px] sm:text-[10px] tracking-[0.32em] sm:tracking-[0.4em] font-cinzel text-gold-200 uppercase">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Ritual control bar */}
        <div
          className="
            flex gap-8 sm:gap-12 items-center
            bg-black/45 backdrop-blur-md
            px-6 sm:px-8 py-3 sm:py-4
            rounded-2xl
            border border-white/10
            shadow-[0_0_40px_rgba(212,175,55,0.08)]
          "
        >
          <div className="flex flex-col items-center gap-2 text-white/90">
            <div className="text-xl sm:text-2xl drop-shadow-md">✊</div>
            <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-semibold">
              Reiniciar
            </span>
          </div>

          <div className="w-[1px] h-5 bg-white/15" />

          <div className="flex flex-col items-center gap-2 text-white/90">
            <div className="text-xl sm:text-2xl drop-shadow-md">✋</div>
            <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-semibold">
              Mezclar
            </span>
          </div>

          <div className="w-[1px] h-5 bg-white/15" />

          <div className="flex flex-col items-center gap-2 text-white/90">
            <div className="text-xl sm:text-2xl drop-shadow-md">☝️</div>
            <span className="text-[8px] sm:text-[9px] tracking-widest uppercase font-semibold">
              Elegir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
