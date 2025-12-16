'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Landing from '@/components/Landing';
import GameTable from '@/components/GameTable'; // <--- Importar
import { Room } from '@/types/room';

export default function Home() {
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_joined', (newRoom: Room) => {
      setRoom(newRoom);
    });

    socket.on('room_updated', (updatedRoom: Room) => {
      // <--- Escuchar actualizaciones
      setRoom(updatedRoom);
    });

    socket.on('error', (err: { message: string }) => {
      alert(err.message);
    });

    return () => {
      socket.off('room_joined');
      socket.off('room_updated');
      socket.off('error');
    };
  }, [socket]);

  const handleCreate = (name: string) => socket?.emit('create_room', { name });
  const handleJoin = (name: string, roomId: string) =>
    socket?.emit('join_room', { roomId, name });

  // Función placeholder para votar (la implementaremos en el backend enseguida)
  const handleVote = (card: string) => {
    console.log('Votando:', card);
    // TODO: socket?.emit("vote", { roomId: room?.id, card });
  };

  if (!isConnected)
    return <div className="text-white text-center mt-20">Conectando...</div>;

  return (
    <main className="min-h-screen bg-gray-900">
      {!room ? (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <Landing onCreate={handleCreate} onJoin={handleJoin} />
        </div>
      ) : (
        // Renderizar la mesa si hay sala. Pasamos socket.id como currentUserId
        <GameTable
          room={room}
          currentUserId={socket?.id || ''}
          onVote={handleVote}
        />
      )}
    </main>
  );
}
