import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';

@Injectable()
export class RoomsService {
  // Almacén en memoria: ID Sala -> Objeto Room
  private rooms: Map<string, Room> = new Map();

  createRoom(playerName: string, socketId: string): Room {
    const roomId = this.generateRoomId();
    const newRoom: Room = {
      id: roomId,
      players: [{ id: socketId, name: playerName, vote: null, isAdmin: true }],
      isRevealed: false,
    };
    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  joinRoom(roomId: string, playerName: string, socketId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Sala no encontrada');

    const existingPlayer = room.players.find((p) => p.id === socketId);
    if (!existingPlayer) {
      room.players.push({
        id: socketId,
        name: playerName,
        vote: null,
        isAdmin: false,
      });
    }
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  // Generador de IDs cortos (ej: "A7B2")
  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }
}
