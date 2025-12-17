import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  @SubscribeMessage('create_room')
  async handleCreateRoom(
    @MessageBody() data: { name: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomsService.createRoom(data.name, client.id);

    // CORRECCIÓN: Usamos await para asegurar que el socket entra en la sala
    // antes de emitir nada.
    await client.join(room.id);

    client.emit('room_joined', room);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; name: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.joinRoom(
        data.roomId,
        data.name,
        client.id,
      );

      await client.join(room.id);
      client.emit('room_joined', room);
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      // FIX CRÍTICO: Enviamos el mensaje REAL del error (ej: "Sala llena")
      // Si error es un objeto Error, sacamos .message, si no, un genérico.
      const message =
        error instanceof Error ? error.message : 'Error desconocido al unirse';

      client.emit('error', { message });
    }
  }

  @SubscribeMessage('vote')
  handleVote(
    @MessageBody() data: { roomId: string; card: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.vote(data.roomId, client.id, data.card);
      // Emitimos a todos para que vean que este usuario ya tiene carta boca abajo
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      console.error(error);
    }
  }

  handleDisconnect(client: Socket) {
    const result = this.roomsService.leaveRoom(client.id);

    if (result) {
      if (result.room) {
        // Emitimos notificación PRIMERO
        this.server
          .to(result.roomId)
          .emit('user_left', { name: result.leaverName });
        // Luego actualizamos la sala (para que desaparezca de la lista)
        this.server.to(result.roomId).emit('room_updated', result.room);
      }
    }
  }

  @SubscribeMessage('reveal_cards')
  handleRevealCards(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.revealCards(data.roomId, client.id);
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('reset_room')
  handleResetRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.resetRoom(data.roomId, client.id);
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      console.error(error);
    }
  }
}
