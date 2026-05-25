# ─── Stage: Production ───────────────────────────────────────────────────────
FROM node:22-alpine

# Cài deps trước để tận dụng layer cache
# (chỉ rebuild layer này khi package.json thay đổi)
COPY server/package*.json /app/server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy toàn bộ project: frontend tĩnh + server source
WORKDIR /app
COPY . .

EXPOSE 3000

WORKDIR /app/server
CMD ["node", "src/index.js"]
