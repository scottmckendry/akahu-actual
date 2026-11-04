FROM docker.io/oven/bun:1.4.4-slim

WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile --production

COPY --chown=bun:bun src ./src

USER bun

CMD ["bun", "run", "start"]
