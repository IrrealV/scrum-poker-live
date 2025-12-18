import { Injectable } from '@nestjs/common';
import { Room, DeckType } from './interfaces/room.interface';

@Injectable()
export class RoomsService {
  // Almacén en memoria: ID Sala -> Objeto Room
  private rooms: Map<string, Room> = new Map();

  createRoom(playerName: string, socketId: string, sessionToken: string, deckType: DeckType = 'fibonacci'): Room {
    const roomId = this.generateRoomId();
    const newRoom: Room = {
      id: roomId,
      topic: null,
      deckType,
      players: [{ 
        id: socketId, 
        sessionToken,
        name: playerName, 
        vote: null, 
        isAdmin: true 
      }],
      isRevealed: false,
    };
    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  joinRoom(roomId: string, playerName: string, socketId: string, sessionToken: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Sala no encontrada');

    // Buscar si el jugador ya existe por sessionToken (reconexión)
    const existingPlayer = room.players.find((p) => p.sessionToken === sessionToken);
    
    if (existingPlayer) {
      // Reconexión: actualizar socket ID, mantener estado (voto, admin)
      existingPlayer.id = socketId;
      return room;
    }

    // Nuevo jugador: verificar capacidad
    if (room.players.length >= 10) {
      throw new Error('La sala está llena (Máx. 10 jugadores)');
    }

    room.players.push({
      id: socketId,
      sessionToken,
      name: playerName,
      vote: null,
      isAdmin: false,
    });
    
    return room;
  }

  // Reconectar a una sala específica (para F5)
  reconnect(roomId: string, sessionToken: string, socketId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find((p) => p.sessionToken === sessionToken);
    if (!player) return null;

    // Actualizar socket ID
    player.id = socketId;
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // Cambiamos el tipo de retorno para incluir el nombre
  leaveRoom(
    socketId: string,
  ): { roomId: string; room: Room | null; leaverName: string } | null {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex((p) => p.id === socketId);

      if (playerIndex !== -1) {
        const leaverName = room.players[playerIndex].name;
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          this.rooms.delete(roomId);
          return { roomId, room: null, leaverName };
        }

        if (room.players.length > 0 && !room.players.some((p) => p.isAdmin)) {
          room.players[0].isAdmin = true;
        }

        return { roomId, room, leaverName };
      }
    }
    return null;
  }

  vote(roomId: string, socketId: string, card: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Sala no encontrada');

    const player = room.players.find((p) => p.id === socketId);
    if (player) {
      player.vote = card;
    }
    return room;
  }

  revealCards(roomId: string, adminSocketId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Sala no encontrada');

    const requestor = room.players.find((p) => p.id === adminSocketId);
    if (!requestor || !requestor.isAdmin) {
      throw new Error('Solo el administrador puede revelar las cartas');
    }

    room.isRevealed = true;
    return room;
  }

  resetRoom(roomId: string, adminSocketId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Sala no encontrada');

    const requestor = room.players.find((p) => p.id === adminSocketId);
    if (!requestor || !requestor.isAdmin) {
      throw new Error('Solo el administrador puede reiniciar la mesa');
    }

    room.isRevealed = false;
    room.players.forEach((p) => (p.vote = null));
    return room;
  }

  // Actualizar el tema de la sala (solo admin)
  updateTopic(roomId: string, adminSocketId: string, topic: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Sala no encontrada');

    const requestor = room.players.find((p) => p.id === adminSocketId);
    if (!requestor || !requestor.isAdmin) {
      throw new Error('Solo el administrador puede cambiar el tema');
    }

    room.topic = topic;
    return room;
  }

  // Generador de IDs cortos (ej: "A7B2")
  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}
