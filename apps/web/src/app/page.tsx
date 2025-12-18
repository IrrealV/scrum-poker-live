'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import Landing from '@/components/Landing';
import GameContainer from '@/features/game/GameContainer';
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
      });
    });

    socket.on('room_updated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    socket.on("error", (err: { message: string }) => {
      console.log("Error recibido del socket:", err);
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

  const handleReveal = () => {
    if (room?.id) socket?.emit("reveal_cards", { roomId: room.id });
  };

  const handleReset = () => {
    if (room?.id) socket?.emit("reset_room", { roomId: room.id });
  };

  // Loading state
  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary-light)] rounded-2xl mb-4 animate-pulse">
            <span className="text-3xl">🃏</span>
          </div>
          <p className="text-[var(--text-secondary)] font-medium">Conectando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {!room ? (
        <Landing onCreate={handleCreate} onJoin={handleJoin} />
      ) : (
        <GameContainer
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
