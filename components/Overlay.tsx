import React from 'react';
import { GestureState, HandData } from '../types';
import { TAROT_DECK } from '../constants';

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
  forcedIndex
}) => {
  const selectedCard = TAROT_DECK[selectedIndex];

  const getStatusText = () => {
    switch (handData.gesture) {
      case GestureState.INITIAL:
        return "Cierra tu puño y regresa al centro";
      case GestureState.SHUFFLE:
        return "Abre tu palma y deja que la energía fluya";
      case GestureState.DRAWING:
        return "Señala con intención y elige una carta";
      case GestureState.REVEALED:
        return "Muévete suavemente para recibir el mensaje";
      default:
        return "El universo está alineándose...";
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12 z-40 overflow-hidden select-none">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="group">
          <h1 className="text-4xl font-cinzel text-gold tracking-[0.3em] drop-shadow-2xl uppercase">
            Taro Mistica
          </h1>
          <div className="h-[1px] w-0 bg-gold group-hover:w-full transition-all duration-1000 opacity-30 mt-1"></div>
          <p className="text-[9px] text-cyan-300 font-light tracking-[0.6em] uppercase mt-3 opacity-40">
            Sistema de Adivinación Digital v2.5
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={onToggleMode}
            className="px-6 py-2 border border-gold/20 bg-black/20 text-gold/80 font-cinzel text-[10px] tracking-[0.3em] hover:bg-gold/10 hover:border-gold/50 transition-all duration-700 pointer-events-auto backdrop-blur-sm rounded-sm"
          >
            {isMouseMode ? "CONTROL VIRTUAL" : "ENTRADA SENSORIAL"}
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
        <div className="absolute left-16 top-1/2 -translate-y-1/2 max-w-md">
          <div className="bg-black/40 backdrop-blur-3xl p-12 border-l-[1px] border-gold/40 shadow-2xl animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="text-gold/40 text-[9px] tracking-[0.4em] font-bold mb-3 uppercase">
              Señal detectada
            </div>

            <h2 className="text-5xl font-cinzel text-gold mb-4 tracking-wider">
              {selectedCard.name}
            </h2>

            {/* Energy line (only shows if your deck objects include `energy`) */}
            {selectedCard.energy && (
              <div className="text-[11px] tracking-[0.35em] uppercase text-white/50 font-light mb-8">
                {selectedCard.energy}
              </div>
            )}

            <div className="w-16 h-[1px] bg-gold/20 mb-8"></div>

            <p className="text-xl text-white/80 font-light leading-relaxed font-serif italic">
              {selectedCard.meaning}
            </p>

            <div className="mt-12 flex items-center gap-4">
              <div className="w-8 h-[1px] bg-gold/10"></div>
              <span className="text-[8px] tracking-[0.5em] uppercase text-gold/30">
                Fin de la transmisión
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Instructions */}
      <div className="flex flex-col items-center gap-8 mb-4">
        <div className="group relative">
          <div className="absolute -inset-4 bg-gold/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative px-16 py-4 bg-black/20 backdrop-blur-md rounded-full border border-white/5 text-center transition-all duration-700 hover:border-gold/30">
            <span className="text-[10px] tracking-[0.4em] font-cinzel text-gold-200 uppercase">
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="flex gap-12 opacity-20 hover:opacity-60 transition-opacity duration-1000 items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="text-xl">✊</div>
            <span className="text-[7px] tracking-widest uppercase font-bold text-white">
              Reiniciar
            </span>
          </div>

          <div className="w-[1px] h-4 bg-white/10"></div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xl">✋</div>
            <span className="text-[7px] tracking-widest uppercase font-bold text-white">
              Mezclar
            </span>
          </div>

          <div className="w-[1px] h-4 bg-white/10"></div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xl">☝️</div>
            <span className="text-[7px] tracking-widest uppercase font-bold text-white">
              Elegir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overlay;