'use client';

import { Room } from "@/types/room";
import PlayerList from "./PlayerList";
import VotingDeck from "./VotingDeck";
import Confetti from "./Confetti";
import toast from "react-hot-toast";
import { useState } from "react";

interface GameUIProps {
  room: Room;
  currentUserId: string;
  isAdmin: boolean;
  average: string;
  actions: {
    vote: (card: string) => void;
    reveal: () => void;
    reset: () => void;
    updateTopic?: (topic: string) => void;
    leave?: () => void;
  };
}

export default function GameLayout({ room, currentUserId, isAdmin, average, actions }: GameUIProps) {
  const [topicInput, setTopicInput] = useState(room.topic || '');

  const copyRoomId = () => {
    navigator.clipboard.writeText(room.id);
    toast.success("¡Código copiado!");
  };

  const handleTopicBlur = () => {
    if (actions.updateTopic && topicInput !== room.topic) {
      actions.updateTopic(topicInput);
    }
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Dividir jugadores: 5 arriba y 5 abajo
  const topPlayers = room.players.slice(0, 5);
  const bottomPlayers = room.players.slice(5, 10);

  // Calcular progreso de votación
  const totalPlayers = room.players.length;
  const votedCount = room.players.filter(p => p.vote !== null).length;

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-6 pb-24 px-4 overflow-x-hidden relative">
      {/* Confetti Effect - Se muestra cuando isRevealed es true */}
      <Confetti isRevealed={room.isRevealed} />

      {/* Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-4 animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🃏</span>
          <span className="font-bold text-(--text-primary) hidden sm:inline">
            Scrum Poker
          </span>
        </div>

        {/* Room Code Badge + Leave Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyRoomId}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-(--border) hover:shadow-md transition-all group"
            title="Click para copiar código"
          >
            <span className="text-xs font-medium text-(--text-secondary)">SALA</span>
            <span className="font-mono font-bold text-(--text-primary) tracking-widest">
              {room.id}
            </span>
            <span className="text-(--text-muted) group-hover:text-(--primary) transition-colors">
            📋
            </span>
          </button>

          {/* Leave Room Button */}
          <button
            onClick={actions.leave}
            className="flex items-center gap-1.5 px-3 py-2 bg-(--error-light) hover:bg-(--error) text-(--error) hover:text-white rounded-full transition-all text-sm font-medium"
            title="Salir de la sala"
          >
            🚪
            <span className="sm:hidden">Salir</span>
          </button>
        </div>
      </header>

      {/* Topic Section */}
      <div className="w-full max-w-4xl mb-6 animate-fade-in-up">
        {isAdmin ? (
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onBlur={handleTopicBlur}
            onKeyDown={handleTopicKeyDown}
            placeholder="📝 Escribe el tema a estimar (ej: JIRA-123)"
            className="w-full px-4 py-3 text-center bg-white border border-(--border) rounded-xl text-sm font-medium text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent transition-all"
            maxLength={100}
          />
        ) : (
          <div className="w-full px-4 py-3 text-center bg-(--background-alt) rounded-xl text-sm font-medium text-(--text-primary)">
            {room.topic || <span className="text-(--text-muted)">Sin tema definido</span>}
          </div>
        )}
      </div>

      {/* Game Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-6">
        
        {/* Top Players Row */}
        <div className="w-full flex justify-center">
          <PlayerList
            players={topPlayers}
            currentUserId={currentUserId}
            isRevealed={room.isRevealed}
          />
        </div>

        {/* Central Table */}
        <div className="relative w-full max-w-sm">
          {/* Table Surface */}
          <div className="card relative w-full aspect-2/1 flex flex-col items-center justify-center border-2 border-(--border) overflow-hidden">
            
            {/* Progress indicator */}
            {!room.isRevealed && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-(--background-alt) rounded-full">
                  <div className="w-2 h-2 rounded-full bg-(--primary) animate-pulse" />
                  <span className="text-xs font-medium text-(--text-secondary)">
                    {votedCount}/{totalPlayers}
                  </span>
                </div>
              </div>
            )}

            {room.isRevealed ? (
              /* REVEALED STATE */
              <div className="flex flex-col items-center animate-bounce-in">
                <span className="text-xs font-medium text-(--text-muted) uppercase tracking-wider mb-1">
                  Promedio
                </span>
                <span className="text-6xl font-bold text-(--text-primary) mb-4">
                  {average}
                </span>

                {/* Reset Button (Admin only) */}
                {isAdmin && (
                  <button
                    onClick={actions.reset}
                    className="flex items-center gap-2 px-5 py-2 bg-(--error-light) hover:bg-(--error) text-(--error) hover:text-white rounded-full text-sm font-semibold transition-all"
                  >
                    <span>🔄</span>
                    Nueva ronda
                  </button>
                )}
              </div>
            ) : (
              /* VOTING STATE */
              <div className="flex flex-col items-center">
                <div className="text-center mb-4 opacity-40">
                  <span className="block text-2xl font-bold text-(--text-primary) tracking-wide">
                    POKER
                  </span>
                  <span className="text-xs font-medium text-(--text-secondary) tracking-[0.3em]">
                    LIVE
                  </span>
                </div>

                {/* Reveal Button (Admin only) */}
                {isAdmin && (
                  <button
                    onClick={actions.reveal}
                    className="btn btn-primary px-8 py-2.5 animate-pulse-soft"
                  >
                    REVELAR
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Players Row */}
        {bottomPlayers.length > 0 && (
          <div className="w-full flex justify-center">
            <PlayerList
              players={bottomPlayers}
              currentUserId={currentUserId}
              isRevealed={room.isRevealed}
            />
          </div>
        )}
      </div>

      {/* Voting Deck (fixed at bottom) */}
      {!room.isRevealed && (
        <VotingDeck
          onVote={actions.vote}
          currentVote={room.players.find(p => p.id === currentUserId)?.vote || null}
          disabled={false}
          deckType={room.deckType}
        />
      )}
    </div>
  );
}