'use client';

import { useState } from 'react';

interface VotingDeckProps {
  onVote: (value: string) => void;
  currentVote: string | null;
  disabled: boolean;
}

const CARDS = [
  '0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕',
];

export default function VotingDeck({ onVote, currentVote, disabled }: VotingDeckProps) {
  const [localSelection, setLocalSelection] = useState<string | null>(null);

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
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-(--border) shadow-lg py-5 px-2 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        {/* Single row: Cards + Selection info + Confirm button */}
        <div className="flex items-center justify-center gap-2">
          {/* Cards - All in one line */}
          <div className="flex items-end gap-1.5 pt-3 overflow-visible">
            {CARDS.map((card) => {
              const isSelected = localSelection === card;
              
              return (
                <button
                  key={card}
                  onClick={() => setLocalSelection(card)}
                  disabled={disabled}
                  className={`
                    shrink-0
                    w-9 h-12 sm:w-10 sm:h-14
                    rounded-lg
                    font-bold text-sm sm:text-base
                    transition-all duration-200
                    border-2
                    ${isSelected
                      ? 'bg-(--primary) text-white border-(--primary) -translate-y-1.5 shadow-md shadow-(--primary)/30'
                      : 'bg-white text-(--text-primary) border-(--border) hover:border-(--primary) hover:-translate-y-0.5'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {card}
                </button>
              );
            })}
          </div>

          {/* Confirm button - appears when selected */}
          {localSelection && (
            <button
              onClick={handleConfirm}
              className="shrink-0 btn btn-primary px-4 py-2 text-sm animate-fade-in-up"
            >
              ✓ Enviar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
