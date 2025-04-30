# build
FROM node:22-slim AS builder
USER node

WORKDIR /build
COPY --chown=node . .
RUN npm install
RUN npx tsc

# runtime
FROM node:22-slim
USER node

WORKDIR /app
COPY --chown=node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder --chown=node /build/dist ./dist

CMD ["node", "dist/index.js"]
