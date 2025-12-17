import { Room } from "@/types/room";
import PlayerList from "./PlayerList";
import VotingDeck from "./VotingDeck";
import toast from "react-hot-toast";

interface GameUIProps {
  room: Room;
  currentUserId: string;
  isAdmin: boolean;
  average: string;
  actions: {
    vote: (card: string) => void;
    reveal: () => void;
    reset: () => void;
  };
}

export default function GameLayout({ room, currentUserId, isAdmin, average, actions }: GameUIProps) {
  const copyRoomId = () => {
    navigator.clipboard.writeText(room.id);
    toast.success("¡Código copiado al portapapeles!");
  };

  // DIVIDIR JUGADORES: 5 arriba y 5 abajo
  const topPlayers = room.players.slice(0, 5); 
  const bottomPlayers = room.players.slice(5, 10);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-10 pb-40 px-4 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-green-800 via-green-900 to-gray-950 overflow-x-hidden relative">
      
      {/* 1. CÓDIGO DE SALA: Esquina Superior Derecha */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={copyRoomId}
          className="bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 transition-all flex flex-col items-end group"
          title="Click para copiar"
        >
          <span className="text-[10px] text-green-200/50 uppercase tracking-widest font-bold">Sala</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold text-white tracking-widest group-hover:text-green-400 transition-colors">{room.id}</span>
            <span className="text-white/30 text-xs group-hover:text-white">📋</span>
          </div>
        </button>
      </div>

      {/* 2. ESPACIO CENTRAL SUPERIOR (Reservado para Título/User Story) */}
      <div className="w-full max-w-2xl h-16 flex items-center justify-center mb-4 z-40">
         {/* Aquí irá el Input del Título más tarde. De momento, vacío y limpio. */}
      </div>

      {/* ÁREA DE JUEGO CENTRAL */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 py-4">
        
        {/* FILA SUPERIOR */}
        <div className="w-full flex justify-center z-20">
            <PlayerList 
                players={topPlayers} 
                currentUserId={currentUserId} 
                isRevealed={room.isRevealed} 
            />
        </div>

        {/* 3. MESA CENTRAL + BOTONES ADMIN */}
        <div className="relative w-[340px] h-[180px] shrink-0">
            {/* El Tapete */}
            <div className="absolute inset-0 rounded-[100px] border-8 border-green-950/40 bg-green-800 shadow-2xl flex flex-col items-center justify-center z-10 transition-all">
                
                {/* LÓGICA DE CONTENIDO DE LA MESA */}
                {room.isRevealed ? (
                    // ESTADO: REVELADO
                    <div className="flex flex-col items-center animate-enter-room">
                        <span className="text-green-200/50 text-[10px] uppercase tracking-widest font-bold mb-1">Promedio</span>
                        <span className="text-7xl font-black text-white drop-shadow-lg mb-2 leading-none">{average}</span>
                        
                        {/* Botón Reset (Solo Admin) */}
                        {isAdmin && (
                          <button 
                            onClick={actions.reset}
                            className="bg-red-500/20 hover:bg-red-500 hover:text-white text-red-200 border border-red-500/50 px-6 py-1 rounded-full text-xs font-bold tracking-wider transition-all uppercase hover:scale-105"
                          >
                            🔄 Resetear
                          </button>
                        )}
                    </div>
                ) : (
                    // ESTADO: OCULTO (VOTANDO)
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center opacity-40 mb-3">
                            <span className="text-green-100 font-bold text-3xl tracking-[0.2em] uppercase">Poker</span>
                            <span className="text-green-300 font-mono text-sm tracking-widest">LIVE</span>
                        </div>

                        {/* Botón Revelar (Solo Admin) */}
                        {isAdmin && (
                          <button 
                            onClick={actions.reveal}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-2 rounded-full text-sm font-black shadow-lg shadow-yellow-900/20 transition-all transform hover:scale-105 active:scale-95 animate-pulse-slow"
                          >
                            REVELAR
                          </button>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* FILA INFERIOR */}
        {bottomPlayers.length > 0 && (
            <div className="w-full flex justify-center z-20">
                <PlayerList 
                    players={bottomPlayers} 
                    currentUserId={currentUserId} 
                    isRevealed={room.isRevealed} 
                />
            </div>
        )}
      </div>

      {/* Baraja */}
      {!room.isRevealed && (
        <VotingDeck 
          onVote={actions.vote} 
          currentVote={room.players.find(p => p.id === currentUserId)?.vote || null} 
          disabled={false} 
        />
      )}
    </div>
  );
}