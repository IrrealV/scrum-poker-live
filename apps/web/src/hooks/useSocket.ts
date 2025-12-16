'use client';

import { useEffect, useState, startTransition } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    // Conectamos al puerto 4000 donde vive nuestra API
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

    // Actualizar el estado de manera asíncrona para evitar renders en cascada
    startTransition(() => {
      setSocket(socketInstance);
    });

    // Limpieza al desmontar el componente
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected, transport };
};
