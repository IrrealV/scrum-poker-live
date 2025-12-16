import { Player } from '@/types/room';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
}

export default function PlayerList({
  players,
  currentUserId,
  isRevealed,
}: PlayerListProps) {
  const [parent] = useAutoAnimate();

  return (
    <div
      ref={parent}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl mb-12"
    >
      {players.map((p) => (
        <div
          key={p.id}
          className={`animate-enter-room relative p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all
            ${
              p.id === currentUserId
                ? 'border-blue-500 bg-blue-900/20'
                : 'border-gray-700 bg-gray-800'
            }
            ${p.vote && !isRevealed ? 'animate-pulse border-yellow-500/50' : ''}
          `}
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center font-bold mb-2">
            {p.name.charAt(0).toUpperCase()}
          </div>

          <span className="font-medium text-white truncate max-w-full">
            {p.name}
          </span>

          <div className="mt-2 h-8 flex items-center justify-center">
            {isRevealed && p.vote ? (
              <span className="text-xl font-bold text-green-400">{p.vote}</span>
            ) : p.vote ? (
              <span className="text-2xl">🃏</span>
            ) : (
              <span className="text-xs text-gray-500 italic">Pensando...</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
