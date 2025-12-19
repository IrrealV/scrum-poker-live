# -----------------------------------------------------------------------------
# ETAPA 1: BUILDER (Instalar dependencias y compilar)
# En monorepos con bun, es mejor hacer todo en una etapa para evitar
# problemas con symlinks de workspaces
# -----------------------------------------------------------------------------
FROM oven/bun:1 AS builder
WORKDIR /app

# Copiamos TODOS los package.json del monorepo para que el lockfile coincida
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/



# Instalamos dependencias
RUN bun install --frozen-lockfile

# Copiamos todo el código fuente
COPY . .

# Aceptamos la URL como argumento de construcción
ARG NEXT_PUBLIC_API_URL
# La convertimos en variable de entorno para el build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Desactivamos telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Compilamos el proyecto web
WORKDIR /app/apps/web
RUN bun run build

# -----------------------------------------------------------------------------
# ETAPA 2: RUNNER (Imagen final de producción)
# -----------------------------------------------------------------------------
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Creamos un usuario no-root por seguridad
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copiamos SOLO lo necesario desde el builder
# 1. La carpeta pública (imágenes, favicon, etc)
COPY --from=builder /app/apps/web/public ./public

# 2. El modo standalone genera una carpeta con todo lo necesario para correr
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

# Cambiamos al usuario no-root
USER nextjs

# Exponemos el puerto 3000
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# El comando de arranque en modo standalone
CMD ["bun", "apps/web/server.js"]