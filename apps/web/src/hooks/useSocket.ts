'use client';

import { useEffect, useState, startTransition } from 'react';
import { io, Socket } from 'socket.io-client';

// Session token management
const SESSION_TOKEN_KEY = 'scrum-poker-session';
const ROOM_ID_KEY = 'scrum-poker-room';

export const getSessionToken = (): string => {
  if (typeof window === 'undefined') return '';
  
  let token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  return token;
};

export const saveRoomId = (roomId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ROOM_ID_KEY, roomId);
};

export const getSavedRoomId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROOM_ID_KEY);
};

export const clearRoomId = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ROOM_ID_KEY);
};

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    const socketInstance = io('http://localhost:4000', {
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setTransport(socketInstance.io.engine.transport.name);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setTransport('N/A');
    });

    startTransition(() => {
      setSocket(socketInstance);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected, transport };
};
