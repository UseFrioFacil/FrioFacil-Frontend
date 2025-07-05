# Estágio 1: Build da aplicação Vite/React
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servir a aplicação com NGINX
FROM nginx:stable-alpine
# Copia os arquivos estáticos gerados no estágio de build para a pasta padrão do NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# [Opcional, mas recomendado] Copia uma configuração customizada do NGINX para lidar com rotas de Single Page Applications (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 para o Dokploy
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]