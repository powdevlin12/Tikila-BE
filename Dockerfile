# syntax=docker/dockerfile:1

# WORKDIR là /app/tikila-BE (không phải /app) vì src/constants/dir.ts dùng
# path.resolve('../uploads/...') -> uploads phải nằm ở /app/uploads.

# ---------- deps: full dependencies để build ----------
FROM node:22-alpine AS deps
WORKDIR /app/tikila-BE
COPY package*.json ./
RUN npm ci

# ---------- builder: tsc + tsc-alias -> dist ----------
FROM node:22-alpine AS builder
WORKDIR /app/tikila-BE
ENV NODE_OPTIONS=--max-old-space-size=768
COPY --from=deps /app/tikila-BE/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- prod-deps: chỉ dependencies runtime ----------
FROM node:22-alpine AS prod-deps
WORKDIR /app/tikila-BE
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- runner ----------
FROM node:22-alpine AS runner
WORKDIR /app/tikila-BE
ENV NODE_ENV=production

# su-exec để entrypoint hạ quyền từ root xuống node sau khi sửa quyền uploads
RUN apk add --no-cache su-exec

COPY --from=prod-deps --chown=node:node /app/tikila-BE/node_modules ./node_modules
COPY --from=builder  --chown=node:node /app/tikila-BE/dist ./dist
# doc-api.yaml được đọc bằng path.resolve('doc-api.yaml') lúc khởi động
COPY --chown=node:node package.json doc-api.yaml ./

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 1236
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js", "--env=production"]
