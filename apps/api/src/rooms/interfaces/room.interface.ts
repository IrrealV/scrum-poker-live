export interface Player {
  id: string; // Socket ID
  name: string; // Nombre visible
  vote: string | null; // Carta seleccionada (null si no ha votado)
  isAdmin: boolean; // ¿Es quien creó la sala?
}

export interface Room {
  id: string;
  players: Player[];
  isRevealed: boolean; // ¿Se han mostrado las cartas?
}
