'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocket, getSessionToken, saveRoomId, getSavedRoomId, clearRoomId } from '@/hooks/useSocket';
import Landing from '@/components/Landing';
import GameContainer from '@/features/game/GameContainer';
import { Room } from '@/types/room';
import toast from 'react-hot-toast';

export default function Home() {
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(true);
  const hasAttemptedReconnect = useRef(false);

  // Intentar reconexión al cargar (usando ref para evitar setState síncrono)
  useEffect(() => {
    if (!socket || !isConnected || hasAttemptedReconnect.current) return;

    hasAttemptedReconnect.current = true;
    const savedRoomId = getSavedRoomId();
    const sessionToken = getSessionToken();

    if (savedRoomId && sessionToken) {
      socket.emit('reconnect_room', { roomId: savedRoomId, sessionToken });
    } else {
      // Usar setTimeout para evitar setState síncrono en effect
      setTimeout(() => setIsReconnecting(false), 0);
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_joined', (newRoom: Room) => {
      setRoom(newRoom);
      saveRoomId(newRoom.id);
      setIsReconnecting(false);
    });

    socket.on('reconnect_failed', () => {
      clearRoomId();
      setIsReconnecting(false);
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
      socket.off('reconnect_failed');
      socket.off('room_updated');
      socket.off('user_left');
      socket.off('error');
    };
  }, [socket]);

  const handleCreate = (name: string, deckType: 'fibonacci' | 'tshirt' | 'linear') => {
    const sessionToken = getSessionToken();
    socket?.emit("create_room", { name, sessionToken, deckType });
  };

  const handleJoin = (name: string, roomId: string) => {
    const sessionToken = getSessionToken();
    socket?.emit("join_room", { roomId, name, sessionToken });
  };
  
  const handleVote = (card: string) => {
    if (room?.id) socket?.emit("vote", { roomId: room.id, card });
  };

  const handleReveal = () => {
    if (room?.id) socket?.emit("reveal_cards", { roomId: room.id });
  };

  const handleReset = () => {
    if (room?.id) socket?.emit("reset_room", { roomId: room.id });
  };

  const handleUpdateTopic = (topic: string) => {
    if (room?.id) socket?.emit("update_topic", { roomId: room.id, topic });
  };

  // Loading / reconnecting state
  if (!isConnected || isReconnecting) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-(--primary-light) rounded-2xl mb-4 animate-pulse">
            <span className="text-3xl">🃏</span>
          </div>
          <p className="text-(--text-secondary) font-medium">
            {isReconnecting ? 'Reconectando...' : 'Conectando...'}
          </p>
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
          onUpdateTopic={handleUpdateTopic}
        />
      )}
    </main>
  );
}
