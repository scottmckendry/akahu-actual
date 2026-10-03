# build
FROM docker.io/library/node:24 AS builder

WORKDIR /build
COPY . .
RUN npm install
RUN npx tsc
RUN npm prune --omit=dev

# runtime
FROM docker.io/library/node:24-slim

USER node
WORKDIR /app

COPY --from=builder --chown=node /build/package.json ./
COPY --from=builder --chown=node /build/node_modules ./node_modules
COPY --from=builder --chown=node /build/dist ./dist

CMD ["node", "dist/index.js"]
