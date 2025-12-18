'use client';

import { Player } from "@/types/room";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import EmojiAvatar from "./EmojiAvatar";

interface PlayerListProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
}

export default function PlayerList({ players, currentUserId, isRevealed }: PlayerListProps) {
  const [parent] = useAutoAnimate();

  return (
    <div 
      ref={parent} 
      className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full max-w-4xl px-2"
    >
      {players.map((player) => {
        const isMe = player.id === currentUserId;
        const hasVoted = player.vote !== null;

        return (
          <div
            key={player.id}
            className={`
              animate-fade-in-up
              flex flex-col items-center
              p-3 rounded-xl
              transition-all duration-300
              w-20 sm:w-24
              ${isMe 
                ? 'bg-(--primary-light) ring-2 ring-(--primary) ring-opacity-50' 
                : 'bg-white shadow-sm'
              }
            `}
          >
            {/* Avatar + Name */}
            <div className="relative mb-2">
              <EmojiAvatar odUserId={player.id} size="md" />
              {player.isAdmin && (
                <span 
                  className="absolute -top-1 -right-2 text-sm"
                  title="Administrador"
                >
                  👑
                </span>
              )}
            </div>
            
            <span className="text-xs font-medium text-(--text-primary) truncate max-w-full text-center mb-2">
              {player.name}
              {isMe && <span className="text-(--text-muted)"> (tú)</span>}
            </span>

            {/* Card */}
            <div 
              className={`
                perspective-1000
                w-10 h-14 sm:w-12 sm:h-16
                rounded-lg
                transition-all duration-500
                preserve-3d
                ${isRevealed && hasVoted ? 'rotate-y-180' : ''}
              `}
            >
              {/* Card Inner */}
              <div className="relative w-full h-full preserve-3d">
                {/* Card Back (visible when not revealed) */}
                <div 
                  className={`
                    absolute inset-0 backface-hidden
                    rounded-lg
                    flex items-center justify-center
                    transition-all duration-300
                    ${hasVoted 
                      ? 'bg-linear-to-br from-(--primary) to-indigo-600 shadow-md' 
                      : 'bg-(--background-alt) border-2 border-dashed border-(--border)'
                    }
                  `}
                >
                  {hasVoted ? (
                    <span className="text-white text-lg">✓</span>
                  ) : (
                    <span className="text-(--text-muted) text-lg">?</span>
                  )}
                </div>

                {/* Card Front (visible when revealed) */}
                <div 
                  className={`
                    absolute inset-0 backface-hidden rotate-y-180
                    rounded-lg
                    bg-white
                    border-2 border-(--border)
                    flex items-center justify-center
                    shadow-md
                  `}
                >
                  <span className="text-xl sm:text-2xl font-bold text-(--text-primary)">
                    {player.vote || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}