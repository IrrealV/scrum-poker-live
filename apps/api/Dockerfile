# -----------------------------------------------------------------------------
# ETAPA 1: BUILDER
# -----------------------------------------------------------------------------
FROM oven/bun:1 AS builder
WORKDIR /app

# Copiamos TODOS los package.json
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Instalamos todo
RUN bun install --frozen-lockfile

# Copiamos código y compilamos
COPY . .
WORKDIR /app/apps/api
RUN bun run build

# -----------------------------------------------------------------------------
# ETAPA 2: RUNNER (EL CAMBIO ESTÁ AQUÍ)
# -----------------------------------------------------------------------------
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Usuario de seguridad
RUN groupadd --system --gid 1001 nestjs && \
    useradd --system --uid 1001 --gid nestjs nestjs

# --- CAMBIO CLAVE: INSTALACIÓN LIMPIA EN LUGAR DE COPIA ---
# 1. Copiamos de nuevo los definiciones del workspace
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# 2. Instalamos SOLO dependencias de producción directamente aquí
# Esto repara todos los enlaces simbólicos y rutas
RUN bun install --frozen-lockfile --production

# ----------------------------------------------------------

# Copiamos el build compilado del builder
COPY --from=builder --chown=nestjs:nestjs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nestjs /app/packages/shared ./packages/shared

# Permisos y arranque
USER nestjs
EXPOSE 4000
ENV PORT=4000
CMD ["bun", "apps/api/dist/main.js"]