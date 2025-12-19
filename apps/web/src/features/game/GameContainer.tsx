import { Room } from "@/types/room";
import GameUI from "./ui/GameLayout";
import toast from "react-hot-toast";

interface GameTableProps {
  room: Room;
  currentUserId: string;
  onVote: (card: string) => void;
  onReveal?: () => void;
  onReset?: () => void;
  onUpdateTopic?: (topic: string) => void;
  onLeave?: () => void;
}

export default function GameContainer({ room, currentUserId, onVote, onReveal, onReset, onUpdateTopic, onLeave }: GameTableProps) {
  const me = room.players.find((p) => p.id === currentUserId);
  const isAdmin = !!me?.isAdmin;

  const votes = room.players.map(p => p.vote).filter(v => v !== null && v !== "?" && v !== "☕");
  const average = votes.length > 0 
    ? (votes.reduce((a, b) => a + Number(b), 0) / votes.length).toFixed(1) 
    : "0";

  const handleReveal = () => {
    if (!onReveal) return;

    const totalPlayers = room.players.length;
    const votersCount = room.players.filter(p => p.vote !== null).length;
    const percentage = totalPlayers > 0 ? votersCount / totalPlayers : 0;

    if (percentage < 0.9) {
      toast.error(`Solo ha votado el ${Math.round(percentage * 100)}% de la sala. Se necesita el 90%.`, {
        icon: '⏳'
      });
      return;
    }

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
    reveal: handleReveal,
    reset: handleReset,
    updateTopic: onUpdateTopic,
    leave: onLeave,
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