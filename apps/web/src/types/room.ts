export interface Player {
  id: string;
  sessionToken: string;
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

// Configuración de barajas
export const DECKS: Record<DeckType, string[]> = {
  fibonacci: ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕'],
  tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
  linear: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '?'],
};

export const DECK_LABELS: Record<DeckType, string> = {
  fibonacci: 'Fibonacci (0, 1, 2, 3, 5...)',
  tshirt: 'Tallas (XS, S, M, L...)',
  linear: 'Lineal (1-10)',
};
