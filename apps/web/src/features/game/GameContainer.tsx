import { Room } from "@/types/room";
import GameUI from "./ui/GameLayout";
import toast from "react-hot-toast"; // Necesario para el error

interface GameTableProps {
  room: Room;
  currentUserId: string;
  onVote: (card: string) => void;
  onReveal?: () => void;
  onReset?: () => void;
}

export default function GameContainer({ room, currentUserId, onVote, onReveal, onReset }: GameTableProps) {
  const me = room.players.find((p) => p.id === currentUserId);
  const isAdmin = !!me?.isAdmin;

  const votes = room.players.map(p => p.vote).filter(v => v !== null && v !== "?" && v !== "☕");
  const average = votes.length > 0 
    ? (votes.reduce((a, b) => a + Number(b), 0) / votes.length).toFixed(1) 
    : "0";

  // LÓGICA DE VALIDACIÓN 90%
  const handleReveal = () => {
    if (!onReveal) return;

    const totalPlayers = room.players.length;
    // Contamos jugadores que han votado (cualquier cosa que no sea null)
    const votersCount = room.players.filter(p => p.vote !== null).length;
    
    // Calculamos el porcentaje (evitamos división por cero)
    const percentage = totalPlayers > 0 ? votersCount / totalPlayers : 0;

    if (percentage < 0.9) {
      toast.error(`Solo ha votado el ${Math.round(percentage * 100)}% de la sala. Se necesita el 90%.`, {
        icon: '⏳'
      });
      return;
    }

    // Si pasa la validación, procedemos
    onReveal();
    toast.success("¡Cartas reveladas!");
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      toast.success("Mesa reiniciada");
    }
  };

  const actions = {
    vote: onVote,
    reveal: handleReveal, // Usamos nuestra función con validación
    reset: handleReset,   // Usamos nuestra función con toast
  };

  return (
    <GameUI 
      room={room} 
      currentUserId={currentUserId} 
      isAdmin={isAdmin} 
      average={average} 
      actions={actions}
    />
  );
}