# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

ARG SIGNALING_SERVER=http://localhost:8000

ENV VITE_REACT_APP_SIGNALING_SERVER=$SIGNALING_SERVER

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
