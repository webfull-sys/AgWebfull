# AgWebfull — Dockerfile Multi-Stage
# Baseado no agency-agents-app (MIT) por Michael Sitarzewski
# Adaptado para SaaS web por Webfull (https://webfull.com.br)

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependências primeiro (cache layer)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copiar código fonte e buildar
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Instalar wget para healthcheck + criar user não-root
RUN apk add --no-cache wget && \
    addgroup -g 1001 -S nodejs && \
    adduser -S agwebfull -u 1001

# Copiar apenas o build e dependências de produção
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Metadados
LABEL maintainer="Webfull <dev@webfull.com.br>"
LABEL description="AgWebfull - SaaS web para gerenciar personas de agentes IA"
LABEL version="0.1.0"

# Configurar ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV ORIGIN=https://agwebfull.webfullvps.com.br

# Expor porta
EXPOSE 3000

# Usar user não-root
USER agwebfull

# Health check (start-period de 30s para dar tempo ao Node iniciar)
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Iniciar app (adapter-node gera o handler)
CMD ["node", "build"]
