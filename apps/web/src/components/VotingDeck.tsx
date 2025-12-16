interface VotingDeckProps {
  onVote: (value: string) => void;
  selectedValue: string | null;
  disabled: boolean;
}

const CARDS = [
  '0',
  '0.5',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '20',
  '40',
  '100',
  '?',
  '☕',
];

export default function VotingDeck({
  onVote,
  selectedValue,
  disabled,
}: VotingDeckProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-md border-t border-gray-700 p-6 pb-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-gray-400 mb-4 text-sm font-mono">
          SELECCIONA TU CARTA
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {CARDS.map((card) => (
            <button
              key={card}
              onClick={() => onVote(card)}
              disabled={disabled}
              className={`
                  w-12 h-16 sm:w-16 sm:h-24 rounded-lg font-bold text-lg sm:text-2xl shadow-lg transition-all transform hover:-translate-y-2
                  ${
                    selectedValue === card
                      ? 'bg-blue-600 text-white ring-4 ring-blue-400/50 -translate-y-4'
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                `}
            >
              {card}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}