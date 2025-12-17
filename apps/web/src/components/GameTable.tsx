import { Room } from "@/types/room";
import PlayerList from "./PlayerList";
import VotingDeck from "./VotingDeck";
import toast from "react-hot-toast";

interface GameTableProps {
  room: Room;
  currentUserId: string;
  onVote: (card: string) => void;
  // Nuevas props para las acciones de admin
  onReveal?: () => void;
  onReset?: () => void;
  onTopicChange?: (topic: string) => void; // Para más tarde
}

export default function GameTable({ room, currentUserId, onVote, onReveal, onReset }: GameTableProps) {
  const me = room.players.find((p) => p.id === currentUserId);
  const isAdmin = me?.isAdmin;

  // Calculamos estadísticas simples si está revelado
  const votes = room.players.map(p => p.vote).filter(v => v !== null && v !== "?" && v !== "☕");
  const average = votes.length > 0 
    ? (votes.reduce((a, b) => a + Number(b), 0) / votes.length).toFixed(1) 
    : "0";

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-10 pb-40 px-4">
      {/* Cabecera */}
      <div className="flex flex-col items-center mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
           <div className="bg-gray-800 px-6 py-2 rounded-full border border-gray-700">
            <span className="text-gray-400 mr-2">Sala:</span>
            <span className="text-2xl font-mono font-bold text-white tracking-widest">{room.id}</span>
          </div>
        </div>

        {/* 🛠️ BARRA DE ADMIN - Solo visible para el creador */}
        {isAdmin && (
          <div className="w-full bg-gray-800/50 p-4 rounded-xl border border-blue-500/30 flex flex-wrap items-center justify-between gap-4 mb-8 animate-enter-room">
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded text-white">ADMIN</span>
              <span className="text-sm text-gray-400">Tienes el control de la mesa</span>
            </div>
            
            <div className="flex gap-3">
              {!room.isRevealed ? (
                <button 
                  onClick={
                    () => {if (onReveal){
                      onReveal();
                      toast.success('¡Cartas reveladas!');
                    }
                  }}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-colors"
                >
                  👁️ Revelar Cartas
                </button>
              ) : (
                <button 
                  onClick={
                    () => {if (onReset){
                      onReset();
                      toast.success('Mesa reiniciada para la siguiente ronda');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-colors"
                >
                  🔄 Nueva Ronda (Reset)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Resultados (Solo visible si revelado) */}
        {room.isRevealed && (
          <div className="mb-8 flex flex-col items-center animate-enter-room">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Media del Equipo</h3>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-500">
              {average}
            </div>
          </div>
        )}
      </div>

      <PlayerList 
        players={room.players} 
        currentUserId={currentUserId} 
        isRevealed={room.isRevealed} 
      />

      {/* La baraja desaparece si ya se reveló */}
      {!room.isRevealed && (
        <VotingDeck 
          onVote={onVote} 
          currentVote={me?.vote || null} 
          disabled={false} 
        />
      )}
    </div>
  );
}