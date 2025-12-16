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

      // CORRECCIÓN: await aquí también
      await client.join(room.id);

      client.emit('room_joined', room);
      this.server.to(room.id).emit('room_updated', room);
    } catch (error) {
      // Si falla, enviamos error (el catch captura cualquier excepción del servicio)
      client.emit(error, { message: 'No se pudo unir a la sala' });
    }
  }
}
