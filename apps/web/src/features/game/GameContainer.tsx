import { Room, DeckType } from "@/types/room";
import GameUI from "./ui/GameLayout";
import toast from "react-hot-toast";

// T-shirt size to numeric value mapping
const TSHIRT_VALUES: Record<string, number> = {
  'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6
};

// Thresholds for mapping numeric average back to t-shirt size
const VALUE_TO_TSHIRT: [number, string][] = [
  [1.5, 'XS'], [2.5, 'S'], [3.5, 'M'], [4.5, 'L'], [5.5, 'XL'], [Infinity, 'XXL']
];

function calculateAverage(votes: string[], deckType: DeckType): string {
  if (votes.length === 0) return deckType === 'tshirt' ? '-' : '0';
  
  if (deckType === 'tshirt') {
    const numericVotes = votes.map(v => TSHIRT_VALUES[v]).filter(v => v !== undefined);
    if (numericVotes.length === 0) return '-';
    const avg = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    const result = VALUE_TO_TSHIRT.find(([threshold]) => avg < threshold);
    return result ? result[1] : 'XXL';
  }
  
  const numericVotes = votes.map(Number).filter(v => !isNaN(v));
  return numericVotes.length > 0 
    ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
    : '0';
}

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

  const votes = room.players.map(p => p.vote).filter(v => v !== null && v !== "?" && v !== "☕") as string[];
  const average = calculateAverage(votes, room.deckType);

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