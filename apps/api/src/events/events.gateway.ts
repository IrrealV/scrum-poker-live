import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from '../rooms/rooms.service';

const DISCONNECT_TIMEOUT_MS = 5000; // 5 segundos para reconectar

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer() server: Server;

  // Map para guardar timeouts pendientes de desconexión
  private disconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly roomsService: RoomsService) {}

  // Cancelar timeout de desconexión pendiente (cuando reconecta)
  private cancelDisconnectTimeout(socketId: string) {
    const timeout = this.disconnectTimeouts.get(socketId);
    if (timeout) {
      clearTimeout(timeout);
      this.disconnectTimeouts.delete(socketId);
    }
  }

  @SubscribeMessage('create_room')
  async handleCreateRoom(
    @MessageBody()
    data: {
      name: string;
      sessionToken: string;
      deckType?: 'fibonacci' | 'tshirt' | 'linear';
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.roomsService.createRoom(
      data.name,
      client.id,
      data.sessionToken,
      data.deckType || 'fibonacci',
    );

    await client.join(room.id);
    client.emit('room_joined', room);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; name: string; sessionToken: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.joinRoom(
        data.roomId,
        data.name,
        client.id,
        data.sessionToken,
      );

      await client.join(room.id);
      client.emit('room_joined', room);
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido al unirse';
      client.emit('error', { message });
    }
  }

  @SubscribeMessage('reconnect_room')
  async handleReconnectRoom(
    @MessageBody() data: { roomId: string; sessionToken: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.reconnect(
        data.roomId,
        data.sessionToken,
        client.id,
      );

      if (room) {
        // Cancelar timeout de desconexión pendiente
        this.cancelDisconnectTimeout(client.id);

        await client.join(room.id);
        client.emit('room_joined', room);
        this.server.to(room.id).emit('room_updated', room);
      } else {
        client.emit('reconnect_failed');
      }
    } catch {
      client.emit('reconnect_failed');
    }
  }

  @SubscribeMessage('vote')
  handleVote(
    @MessageBody() data: { roomId: string; card: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.vote(data.roomId, client.id, data.card);
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      console.error(error);
    }
  }

  handleDisconnect(client: Socket) {
    const socketId = client.id;

    // Programar eliminación del jugador después del timeout
    const timeout = setTimeout(() => {
      const result = this.roomsService.leaveRoom(socketId);

      if (result?.room) {
        this.server
          .to(result.roomId)
          .emit('user_left', { name: result.leaverName });
        this.server.to(result.roomId).emit('room_updated', result.room);
      }

      this.disconnectTimeouts.delete(socketId);
    }, DISCONNECT_TIMEOUT_MS);

    this.disconnectTimeouts.set(socketId, timeout);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    // Cancelar timeout si existe (salida explícita)
    this.cancelDisconnectTimeout(client.id);

    const result = this.roomsService.leaveRoom(client.id);

    if (result) {
      void client.leave(result.roomId);
      if (result.room) {
        this.server
          .to(result.roomId)
          .emit('user_left', { name: result.leaverName });
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

  @SubscribeMessage('update_topic')
  handleUpdateTopic(
    @MessageBody() data: { roomId: string; topic: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.roomsService.updateTopic(
        data.roomId,
        client.id,
        data.topic,
      );
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      console.error(error);
    }
  }
}
