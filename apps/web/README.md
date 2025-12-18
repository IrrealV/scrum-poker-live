# 🎨 Scrum Poker Web (Frontend)

Frontend construido con **Next.js 14 (App Router)** y **Tailwind CSS**.

## ⚙️ Configuración

El cliente de Socket.io busca conectarse automáticamente a:

- **Dev:** `http://localhost:4000`
- **Prod:** Debe configurarse vía variable de entorno (Pendiente).

## 📂 Arquitectura "Feature-Based"

Para mantener el código escalable, no usamos una carpeta `components` gigante. Usamos `features`:

```text
src/features/game/
├── GameContainer.tsx  # 🧠 SMART Component: Lógica, Sockets, Estado.
└── ui/                # 🎨 DUMB Components: Solo reciben props y pintan HTML.
    ├── GameLayout.tsx
    ├── PlayerList.tsx
    └── ...
```

# 🎨 Estilos

- Usamos Tailwind CSS.

- Animaciones: @formkit/auto-animate y clases transform nativas.

- Clases 3D personalizadas: preserve-3d, rotate-y-180 (definidas en globals.css).
