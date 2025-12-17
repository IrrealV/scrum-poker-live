import { Player } from "@/types/room";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
}

export default function PlayerList({ players, currentUserId, isRevealed }: PlayerListProps) {
  const [parent] = useAutoAnimate();

  return (
    // CAMBIO: Usamos Flexbox en lugar de Grid para centrar filas dinámicamente
    <div ref={parent} className="flex flex-wrap justify-center gap-4 w-full max-w-6xl px-4">
      {players.map((p) => (
        <div
          key={p.id}
          className={`animate-enter-room relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-24 sm:w-32
            ${p.id === currentUserId ? "bg-black/40 ring-2 ring-blue-400/50 transform scale-105" : "bg-black/20 hover:bg-black/30"}
          `}
        >
          <div className="mb-2 text-gray-300 font-bold text-xs bg-black/50 px-2 py-0.5 rounded-full shadow-sm truncate max-w-full">
             {p.name} {p.isAdmin && "👑"}
          </div>

          {/* CARTA CON ANIMACIÓN FLIP 3D */}
          <div className={`
             relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg flex items-center justify-center shadow-2xl transition-all duration-700 preserve-3d
             ${/* Aplicamos rotación si está revelada */ ""}
             ${isRevealed && p.vote ? "rotate-y-180 bg-white" : "bg-linear-to-br from-red-700 to-red-900 border-2 border-white/20"}
             ${p.vote && !isRevealed ? "translate-y-2 shadow-black/50" : ""}
             ${!p.vote ? "opacity-30 border-dashed border-gray-500 bg-transparent" : ""}
          `}>
             {isRevealed && p.vote ? (
               // TRUCO: Rotamos el texto también 180deg para que al girar la carta, el número se vea derecho
               <span className="text-2xl font-black font-mono text-gray-900 rotate-y-180 backface-hidden">{p.vote}</span>
             ) : p.vote ? (
               <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
             ) : (
                <span className="text-2xl opacity-0">.</span>
             )}
          </div>
        </div>
      ))}
    </div>
  );
}