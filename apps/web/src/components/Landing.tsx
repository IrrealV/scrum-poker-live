'use client';

import { useState } from 'react';
import { DeckType, DECK_LABELS } from '@/types/room';

interface LandingProps {
  onCreate: (name: string, deckType: DeckType) => void;
  onJoin: (name: string, roomId: string) => void;
}

export default function Landing({ onCreate, onJoin }: LandingProps) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [deckType, setDeckType] = useState<DeckType>('fibonacci');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create' && name) {
      onCreate(name, deckType);
    } else if (mode === 'join' && name && roomId.length === 4) {
      onJoin(name, roomId);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="card w-full max-w-md p-8 animate-fade-in-up">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-(--primary-light) rounded-2xl mb-4">
            <span className="text-3xl">🃏</span>
          </div>
          <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight">
            Scrum Poker
          </h1>
          <p className="text-(--text-secondary) mt-1 text-sm">
            Estimación ágil en tiempo real
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-(--text-secondary) mb-2"
            >
              Tu nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              maxLength={12}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Ej: María García"
              autoComplete="off"
            />
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-(--background-alt) rounded-xl">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-white text-(--text-primary) shadow-sm'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              Crear sala
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === 'join'
                  ? 'bg-white text-(--text-primary) shadow-sm'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              Unirse
            </button>
          </div>

          {/* Deck Type Selector (only when creating) */}
          {mode === 'create' && (
            <div className="animate-fade-in-up">
              <label 
                htmlFor="deckType" 
                className="block text-sm font-medium text-(--text-secondary) mb-2"
              >
                Tipo de baraja
              </label>
              <select
                id="deckType"
                value={deckType}
                onChange={(e) => setDeckType(e.target.value as DeckType)}
                className="input w-full cursor-pointer"
              >
                {(Object.keys(DECK_LABELS) as DeckType[]).map((type) => (
                  <option key={type} value={type}>{DECK_LABELS[type]}</option>
                ))}
              </select>
            </div>
          )}

          {/* Room Code (only when joining) */}
          {mode === 'join' && (
            <div className="animate-fade-in-up">
              <label 
                htmlFor="roomId" 
                className="block text-sm font-medium text-(--text-secondary) mb-2"
              >
                Código de sala
              </label>
              <input
                id="roomId"
                type="text"
                value={roomId}
                maxLength={4}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="input text-center tracking-[0.3em] uppercase font-mono text-lg"
                placeholder="ABCD"
                autoComplete="off"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name || (mode === 'join' && roomId.length !== 4)}
            className="btn btn-primary w-full py-3.5 text-base"
          >
            {mode === 'create' ? (
              <>
                <span className="mr-2">✨</span>
                Crear nueva sala
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Unirse a la sala
              </>
            )}
          </button>
        </form>

        {/* Footer hint */}
        <p className="text-center text-xs text-(--text-muted) mt-6">
          {mode === 'create' 
            ? 'Serás el administrador de la sala'
            : 'Pide el código a quien creó la sala'
          }
        </p>
      </div>
    </div>
  );
}
