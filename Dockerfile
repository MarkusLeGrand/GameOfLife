# --- Stage 1: build the Vite app ---
FROM node:22-alpine AS build

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# --- Stage 2: serve static files with nginx ---
FROM nginx:1.27-alpine AS runtime

# SPA-aware nginx config (history fallback + asset caching + gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the production build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx alpine already runs nginx in the foreground by default
CMD ["nginx", "-g", "daemon off;"]
