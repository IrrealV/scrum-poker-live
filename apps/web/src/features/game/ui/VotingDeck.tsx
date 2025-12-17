import { useState } from 'react';

interface VotingDeckProps {
  onVote: (value: string) => void;
  currentVote: string | null; // El voto YA confirmado en el servidor
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
  currentVote,
  disabled,
}: VotingDeckProps) {
  // Estado local para la selección PREVIA a confirmar
  const [localSelection, setLocalSelection] = useState<string | null>(null);

  const handleConfirm = () => {
    if (localSelection) {
      onVote(localSelection);
      setLocalSelection(null); // Reseteamos selección local tras confirmar
    }
  };

  // Si ya votaste (currentVote existe), mostramos mensaje de éxito
  if (currentVote) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-green-900/90 backdrop-blur-md border-t border-green-700 p-8 text-center animate-slide-up">
        <h3 className="text-2xl font-bold text-white mb-2">¡Voto Enviado!</h3>
        <p className="text-green-200">
          Has seleccionado la carta:{' '}
          <span className="font-bold text-white text-xl">{currentVote}</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Esperando a que el Admin revele las cartas...
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-700 p-6 pb-8 transition-all duration-300">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Cabecera de Selección */}
        <div className="flex items-center gap-4 mb-6 h-12">
          {localSelection ? (
            <>
              <span className="text-gray-300 text-lg">
                Has seleccionado:{' '}
                <span className="font-bold text-white text-2xl ml-2">
                  {localSelection}
                </span>
              </span>
              <button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95"
              >
                CONFIRMAR
              </button>
            </>
          ) : (
            <span className="text-gray-500 italic">
              Selecciona una carta para votar...
            </span>
          )}
        </div>

        {/* Cartas */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {CARDS.map((card) => (
            <button
              key={card}
              onClick={() => setLocalSelection(card)}
              disabled={disabled}
              className={`
                w-10 h-16 sm:w-14 sm:h-20 rounded-lg font-bold text-lg shadow-md transition-all duration-200
                ${
                  localSelection === card
                    ? 'bg-blue-600 text-white -translate-y-3 shadow-blue-500/50 ring-2 ring-white'
                    : 'bg-white text-gray-900 hover:bg-gray-200 hover:-translate-y-1'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
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
