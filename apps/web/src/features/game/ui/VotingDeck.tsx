'use client';

import { useState } from 'react';
import { DeckType, DECKS } from '@/types/room';

interface VotingDeckProps {
  onVote: (value: string) => void;
  currentVote: string | null;
  disabled: boolean;
  deckType: DeckType;
}

export default function VotingDeck({ onVote, currentVote, disabled, deckType }: VotingDeckProps) {
  const [localSelection, setLocalSelection] = useState<string | null>(null);
  const cards = DECKS[deckType];

  const handleConfirm = () => {
    if (localSelection) {
      onVote(localSelection);
      setLocalSelection(null);
    }
  };

  // Already voted state
  if (currentVote) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-(--success-light) border-t border-(--success) py-4 px-4 animate-slide-up">
        <div className="max-w-md mx-auto flex items-center justify-center gap-3">
          <span className="text-xl">✅</span>
          <span className="text-sm font-medium text-(--text-primary)">
            Votaste: <span className="font-bold text-lg">{currentVote}</span>
          </span>
          <span className="text-xs text-(--text-muted)">
            — Esperando revelar...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-(--border) shadow-lg py-4 animate-slide-up">
      <div className="w-full">
        {/* Mobile: Column layout | Desktop: Row layout */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-3">
          
          {/* Cards container - horizontal scroll on mobile */}
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-1.5 px-4 py-2 w-max sm:w-auto sm:mx-auto">
              {cards.map((card) => {
                const isSelected = localSelection === card;
                
                return (
                  <button
                    key={card}
                    onClick={() => setLocalSelection(card)}
                    disabled={disabled}
                    className={`
                      shrink-0
                      w-10 h-14
                      rounded-lg
                      font-bold text-sm
                      transition-all duration-200
                      border-2
                      ${isSelected
                        ? 'bg-(--primary) text-white border-(--primary) ring-2 ring-(--primary) ring-offset-2'
                        : 'bg-white text-(--text-primary) border-(--border) hover:border-(--primary)'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {card}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm button - Mobile: below | Desktop: right side */}
          {localSelection && (
            <div className="px-4 sm:px-0">
              <button
                onClick={handleConfirm}
                className="shrink-0 btn btn-primary px-6 py-2.5 text-sm animate-fade-in-up"
              >
                ✓ Enviar voto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
