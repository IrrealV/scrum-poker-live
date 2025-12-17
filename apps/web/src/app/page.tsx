'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Landing from '@/components/Landing';
import GameTable from '@/features/game/GameContainer';
import { Room } from '@/types/room';
import toast from 'react-hot-toast';

export default function Home() {
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_joined', (newRoom: Room) => {
      setRoom(newRoom);
    });

    socket.on('user_left', (data: { name: string }) => {
      toast(`${data.name} ha abandonado la sala`, {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    });

    socket.on('room_updated', (updatedRoom: Room) => {
      // <--- Escuchar actualizaciones
      setRoom(updatedRoom);
    });

    socket.on("error", (err: { message: string }) => {
      console.log("Error recibido del socket:", err); // <--- AÑADE ESTO PARA DEPURAR EN CONSOLA
      toast.error(err.message, {
        duration: 4000,
        icon: '🚫'
      });
    });
    return () => {
      socket.off('room_joined');
      socket.off('room_updated');
      socket.off('user_left');
      socket.off('error');
    };
  }, [socket]);

  const handleCreate = (name: string) => socket?.emit("create_room", { name });
  const handleJoin = (name: string, roomId: string) => socket?.emit("join_room", { roomId, name });
  
  const handleVote = (card: string) => {
    if (room?.id) socket?.emit("vote", { roomId: room.id, card });
  };

  // NUEVAS FUNCIONES DE ADMIN
  const handleReveal = () => {
    if (room?.id) socket?.emit("reveal_cards", { roomId: room.id });
  };

  const handleReset = () => {
    if (room?.id) socket?.emit("reset_room", { roomId: room.id });
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
          onReveal={handleReveal}
          onReset={handleReset}
        />
      )}
    </main>
  );
}
