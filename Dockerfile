# Etapa 1 - Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files e instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Limpar cache e fazer build fresh
RUN rm -rf dist node_modules/.cache
RUN npm run build

# Etapa 2 - Produção
FROM nginx:stable-alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configurar permissões
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 24319

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:24319 || exit 1

CMD ["nginx", "-g", "daemon off;"]
