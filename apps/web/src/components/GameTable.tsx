import { Room } from '@/types/room';
import PlayerList from './PlayerList';
import VotingDeck from './VotingDeck';

interface GameTableProps {
  room: Room;
  currentUserId: string; // ID del socket actual
  onVote: (card: string) => void;
}

export default function GameTable({
  room,
  currentUserId,
  onVote,
}: GameTableProps) {
  const me = room.players.find((p) => p.id === currentUserId);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-10 pb-40 px-4">
      {/* Cabecera... (igual) */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-gray-800 px-6 py-2 rounded-full border border-gray-700 mb-4">
          <span className="text-gray-400 mr-2">Sala:</span>
          <span className="text-2xl font-mono font-bold text-white tracking-widest">
            {room.id}
          </span>
        </div>
      </div>

      <PlayerList
        players={room.players}
        currentUserId={currentUserId}
        isRevealed={room.isRevealed}
      />

      {/* Solo mostramos la baraja si NO se han revelado las cartas */}
      {!room.isRevealed && (
        <VotingDeck
          onVote={onVote}
          currentVote={me?.vote || null} // <--- Pasamos el voto actual
          disabled={false}
        />
      )}
    </div>
  );
}
