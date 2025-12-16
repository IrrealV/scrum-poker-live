'use client';

import { useSocket } from '@/hooks/useSocket';

export default function Home() {
  const { isConnected, transport } = useSocket();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600 mb-8">
          ScrumPoker Live
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <div
          className={`p-6 rounded-lg border ${
            isConnected
              ? 'border-green-500 bg-green-900/20'
              : 'border-red-500 bg-red-900/20'
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">Estado del Sistema</h2>
          <div className="flex flex-col gap-2">
            <p>
              WebSocket:{' '}
              <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                {isConnected ? 'CONECTADO 🟢' : 'DESCONECTADO 🔴'}
              </span>
            </p>
            <p className="text-xs text-gray-400">Transporte: {transport}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
