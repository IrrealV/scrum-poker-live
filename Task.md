# 🚨 Prioridad Alta (Core & UX)

## 🔄 Persistencia de Sesión (Reconexión)

- El problema: Al dar F5, Socket.io genera un nuevo id y el servidor te trata como un usuario nuevo (o te duplica).

- La Tarea: Implementar un mecanismo de reconexión.

- Front: Guardar un userId o token único en localStorage al entrar. Al recargar, enviar ese token.

- Back: Buscar si ese token ya existe en la sala y reconectar ese usuario al nuevo socket, manteniendo su estado (voto, rol de admin).

## 📝 Gestión del Tema (User Story)

- Frontend: Añadir input en la cabecera (solo Admin) para escribir el título de la tarea (ej: "JIRA-123").

- Backend: Añadir campo topic a la Room y evento update_topic.

- Frontend: Mostrar el tema en tiempo real a todos los jugadores.

# 🌟 Prioridad Media (Features)

## 🃏 Barajas Personalizadas (Custom Decks)

- Landing: Selector al crear sala: Fibonacci (Standard), Tallas (XS, S, M, L, XL), o Lineal (1-10).

- Backend: Guardar la configuración deckType en la Sala.

- Frontend: Adaptar VotingDeck para renderizar los botones correctos según la configuración.
