import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { io, Socket } from 'socket.io-client';
import { Room, Player } from '../src/rooms/interfaces/room.interface';

describe('Scrum Poker Gateway (e2e)', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let otherSocket: Socket;
  let url: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0); // Listen on random port
    url = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach((done) => {
    clientSocket = io(url, { autoConnect: false, transports: ['websocket'] });
    otherSocket = io(url, { autoConnect: false, transports: ['websocket'] });
    done();
  });

  afterEach(() => {
    if (clientSocket.connected) clientSocket.disconnect();
    if (otherSocket.connected) otherSocket.disconnect();
  });

  it('should create a room and allow another user to join', (done) => {
    clientSocket.connect();
    otherSocket.connect();

    const userName = 'ScrumMaster';
    const deckType = 'fibonacci';
    const sessionToken = 'user1-token';

    clientSocket.emit('create_room', {
      name: userName,
      sessionToken,
      deckType,
    });

    clientSocket.on('room_joined', (room: Room) => {
      expect(room.players[0].name).toBe(userName);
      expect(room.deckType).toBe(deckType);

      const roomId = room.id;
      const otherUser = 'Developer';
      const otherToken = 'user2-token';

      otherSocket.emit('join_room', {
        roomId,
        name: otherUser,
        sessionToken: otherToken,
      });

      otherSocket.on('room_joined', (joinedRoom: Room) => {
        expect(joinedRoom.id).toBe(roomId);
      });

      // Listen for updates on the creator to verify the join
      clientSocket.on('room_updated', (updatedRoom: Room) => {
        if (updatedRoom.players.length === 2) {
          const p1 = updatedRoom.players.find(
            (p: Player) => p.name === userName,
          );
          const p2 = updatedRoom.players.find(
            (p: Player) => p.name === otherUser,
          );

          expect(p1).toBeDefined();
          expect(p2).toBeDefined();
          done();
        }
      });
    });
  });

  it('should handle voting flow', (done) => {
    clientSocket.connect();
    otherSocket.connect();

    clientSocket.emit('create_room', {
      name: 'Alice',
      sessionToken: 'abc',
      deckType: 'fibonacci',
    });

    let roomId: string;
    let hasVoted = false;

    clientSocket.on('room_joined', (room: Room) => {
      roomId = room.id;
      otherSocket.emit('join_room', {
        roomId,
        name: 'Bob',
        sessionToken: 'xyz',
      });
    });

    clientSocket.on('room_updated', (room: Room) => {
      const pCount = room.players.length;

      // Wait for both to be in
      if (pCount === 2 && !hasVoted) {
        hasVoted = true;
        clientSocket.emit('vote', { roomId: room.id, card: '5' });
        otherSocket.emit('vote', { roomId: room.id, card: '8' });
      }

      // Check verification phase
      const p1 = room.players.find((p: Player) => p.name === 'Alice');
      const p2 = room.players.find((p: Player) => p.name === 'Bob');

      if (p1?.vote && p2?.vote && !room.isRevealed) {
        // Both voted, but not revealed yet
        expect(p1.vote).toBe('5');
        expect(p2.vote).toBe('8');

        // Reveal
        clientSocket.emit('reveal_cards', { roomId: room.id });
      }

      if (room.isRevealed) {
        expect(p1!.vote).toBe('5');
        expect(p2!.vote).toBe('8');
        expect(room.isRevealed).toBe(true);
        done();
      }
    });
  }, 10000); // Increased timeout
});
