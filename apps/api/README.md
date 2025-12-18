# 🧠 Scrum Poker API (Backend)

Backend construido con **NestJS** que gestiona la lógica de las salas y los WebSockets.

## ⚙️ Variables de Entorno (.env)

| Variable      | Valor por defecto             | Descripción                               |
| ------------- | ----------------------------- | ----------------------------------------- |
| `PORT`        | `4000`                        | Puerto donde corre el servidor HTTP y WS. |
| `CORS_ORIGIN` | `*` o `http://localhost:3000` | Orígenes permitidos para conexión socket. |

## 🛠️ Comandos Específicos

```bash
# Crear un nuevo recurso (Module, Controller, Service)
bun x nest g resource <nombre_recurso>

# Correr en modo watch (solo backend)
bun run start:dev
```

## 🏗️ Estructura Clave

- `src/events`: Gateway de WebSockets.(Entrada de eventos)
- `src/rooms`: Lógica de las de Negocio.(Service) y estado de memoria
