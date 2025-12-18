/**
 * EmojiAvatar - Asigna un emoji consistente basado en el ID del usuario
 * El emoji es determinístico: el mismo ID siempre genera el mismo emoji
 */

interface EmojiAvatarProps {
  odUserId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Lista de 20 emojis de animales/criaturas amigables
const AVATAR_EMOJIS = [
  '🦊', '🐸', '🦄', '🐼', '🦁',
  '🐯', '🐻', '🐨', '🐵', '🐙',
  '🦋', '🐝', '🐢', '🦜', '🦩',
  '🐺', '🦈', '🐬', '🦭', '🐘',
];

// Función hash simple para convertir string a número
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Tamaños predefinidos
const SIZES = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-5xl',
};

export default function EmojiAvatar({ odUserId, size = 'lg', className = '' }: EmojiAvatarProps) {
  const index = hashString(odUserId) % AVATAR_EMOJIS.length;
  const emoji = AVATAR_EMOJIS[index];
  
  return (
    <div 
      className={`
        flex items-center justify-center
        ${SIZES[size]}
        ${className}
      `}
      role="img"
      aria-label={`Avatar de usuario`}
    >
      {emoji}
    </div>
  );
}

// Export para usar el emoji directamente si se necesita
export function getEmojiForUser(odUserId: string): string {
  const index = hashString(odUserId) % AVATAR_EMOJIS.length;
  return AVATAR_EMOJIS[index];
}
