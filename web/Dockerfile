# Etapa 1 - Build
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copia apenas manifestos (aproveita cache do Docker)
COPY package*.json ./

# 2. Instala dependências (npm ci é mais rápido e determinístico)
RUN npm ci

# 3. Copia o código-fonte ANTES de buildar
COPY . .

# 4. Gera os arquivos estáticos
RUN npm run build

# Etapa 2 - Servir com servidor estático leve (sem Nginx)
FROM node:20-alpine

WORKDIR /app

# Instala o serve (servidor estático otimizado para produção)
RUN npm install -g serve

# Copia apenas o output da build
COPY --from=builder /app/dist ./dist

# 🔒 Segurança: executa como usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# ⚙️ Defaults
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 🚀 Inicia o servidor (-s ativa fallback para SPA / React Router / Vue Router)
CMD ["serve", "-s", "dist"]