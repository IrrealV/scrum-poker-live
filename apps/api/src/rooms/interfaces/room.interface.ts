export interface Player {
  id: string; // Socket ID (puede cambiar en F5)
  sessionToken: string; // Token único persistente en localStorage
  name: string;
  vote: string | null;
  isAdmin: boolean;
}

export type DeckType = 'fibonacci' | 'tshirt' | 'linear';

export interface Room {
  id: string;
  topic: string | null;
  deckType: DeckType;
  players: Player[];
  isRevealed: boolean;
}
