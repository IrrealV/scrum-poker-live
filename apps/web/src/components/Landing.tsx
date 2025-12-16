import { useState } from 'react';

interface LandingProps {
  onCreate: (name: string) => void;
  onJoin: (name: string, roomId: string) => void;
}

export default function Landing({ onCreate, onJoin }: LandingProps) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');

  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
        ScrumPoker Live
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tu Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Ej: Maelle"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => name && onCreate(name)}
            disabled={!name}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition"
          >
            Crear Sala
          </button>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white text-center tracking-widest uppercase focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="CÓDIGO"
            />
            <button
              onClick={() => name && roomId && onJoin(name, roomId)}
              disabled={!name || !roomId}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white text-sm transition"
            >
              Unirse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
