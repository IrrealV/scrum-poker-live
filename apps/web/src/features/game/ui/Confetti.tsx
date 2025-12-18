'use client';

import { useMemo } from 'react';

interface ConfettiProps {
  /** Mostrar confetti cuando isRevealed cambia a true */
  isRevealed: boolean;
}

// Colores corporativos suaves para confetti
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

// Genera partículas con valores fijos para SSR
function generateParticles(seed: number): Particle[] {
  // Usamos un generador pseudo-aleatorio con seed para consistencia
  const random = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };
  
  return Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: random(i * 3) * 100,
    color: COLORS[Math.floor(random(i * 5) * COLORS.length)],
    delay: random(i * 7) * 400,
    size: 6 + random(i * 11) * 6,
  }));
}

/**
 * Componente de confetti puramente visual.
 * Se muestra cuando isRevealed es true.
 * La animación CSS maneja el fade-out automáticamente.
 */
export default function Confetti({ isRevealed }: ConfettiProps) {
  // Memoizar partículas para que no cambien
  const particles = useMemo(() => generateParticles(42), []);

  // Solo renderizar cuando está revelado
  if (!isRevealed) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '2px',
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
