# Etapa 1: Build
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir arquivos estáticos
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Remove o arquivo de configuração padrão do NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona o seu próprio (opcional, para SPA funcionar)
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
