# 🃏 Scrum Poker Live

Una aplicación de Scrum Poker en tiempo real, moderna y minimalista, diseñada para equipos ágiles. Construida con un enfoque en rendimiento, UX fluida y arquitectura escalable.

## 🚀 Tech Stack

**Infraestructura & Runtime:**

- **Runtime:** [Bun](https://bun.sh) (Gestor de paquetes, test runner y runtime).
- **Monorepo:** Workspaces de Bun.

**Frontend (`apps/web`):**

- **Framework:** Next.js 14+ (App Router).
- **Estilos:** Tailwind CSS (Diseño responsive y animaciones).
- **Estado/Lógica:** React Hooks + Socket.io Client.
- **UI Libraries:** `@formkit/auto-animate` (Transiciones automáticas), `react-hot-toast` (Notificaciones).

**Backend (`apps/api`):**

- **Framework:** NestJS (Modular architecture).
- **Real-time:** Socket.io (Gateway events).
- **Persistencia:** In-Memory (actualmente), preparado para escalado.

---

## ✨ Funcionalidades Principales

### 🎮 Core Gameplay

- **Votación en Tiempo Real:** Comunicación bidireccional instantánea mediante WebSockets.
- **Sistema de Salas:** Creación y unión a salas mediante códigos únicos (UUID corto).
- **Límite de Jugadores:** Capacidad máxima de 10 usuarios por sala para mantener el rendimiento y orden.
- **Validación de Voto:** Sistema de seguridad que requiere un consenso mínimo (90% de votos) para revelar las cartas.

### 👮‍♂️ Rol de Administrador (Room Creator)

- **Control Exclusivo:** Solo el creador de la sala ve los controles de gestión.
- **Flujo de Juego:**
  - **Revelar:** Voltea las cartas de todos los usuarios simultáneamente.
  - **Reset:** Limpia la mesa y los votos para la siguiente historia de usuario.

### 🎨 UX/UI Avanzada

- **Diseño Orbital:** Mesa de póker central con distribución inteligente de jugadores (Norte/Sur) para evitar solapamientos.
- **Animaciones 3D:** Efecto de "Flip" realista en las cartas (con corrección de efecto espejo).
- **Feedback Inmediato:** Validaciones visuales y notificaciones Toast para errores (Sala llena, Sala no encontrada) y acciones exitosas.
- **Responsive:** Adaptado a móviles, tablets y escritorio.

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura **Monorepo** con separación de dominios basada en **Features** en el frontend para escalar limpiamente.

```text
.
├── apps
│   ├── api                 # 🧠 Backend (NestJS)
│   │   ├── src
│   │   │   ├── events      # WebSocket Gateway (Manejo de eventos socket.io)
│   │   │   ├── rooms       # Lógica de Negocio (Service) y Modelos
│   │   │   └── ...
│   │   └── ...
│   │
│   └── web                 # 🎨 Frontend (Next.js)
│       ├── src
│       │   ├── app         # Rutas (Next.js App Router)
│       │   ├── hooks       # Custom Hooks (useSocket)
│       │   ├── types       # Interfaces compartidas (TypeScript)
│       │   │
│       │   └── features    # 📦 Feature-Based Architecture
│       │       └── game    # Todo lo relacionado con el juego
│       │           ├── ui  # Componentes Visuales ("Dumb Components")
│       │           │   ├── GameLayout.tsx  # La Mesa, el Tapete y la disposición
│       │           │   ├── PlayerList.tsx  # Cartas y Avatares
│       │           │   └── VotingDeck.tsx  # Baraja de votación
│       │           │
│       │           └── GameContainer.tsx   # Lógica ("Smart Component")
│       │                                   # Maneja estado, sockets y reglas
│       └── ...
└── package.json            # Scripts del Monorepo
```

## 🤖 Contexto para Agentes de IA

Si eres un LLM o Agente (Cursor, Windsurf, Antigravity) trabajando en este repo, ten en cuenta:

1. Arquitectura: Preferimos separar lógica (Container) de vista (Layout/UI). No mezcles lógica de sockets dentro de componentes puramente visuales.

2. Estilado: Usa Tailwind CSS para todo. Evita CSS modules a menos que sea estrictamente necesario para animaciones complejas 3D (preserve-3d, rotate-y-180).

3. Gestión de Estado: El estado del juego es efímero y reside en GameContainer sincronizado vía eventos de Socket (room_updated).

4. Testing: Al generar tests, enfócate en testear la lógica de negocio en apps/api/src/rooms/rooms.service.ts y la integración de eventos en apps/web/src/features/game/GameContainer.tsx.

## Instalación y uso

```bash
# 1. Instalar dependencias (desde la raiz del monorepo)
bun install

# 2. Ejecutar en modo desarrollo (Backend + Frontend)
bun run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:4000
