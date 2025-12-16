export interface Player {
  id: string;
  name: string;
  vote: string | null;
  isAdmin: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  isRevealed: boolean;
}
