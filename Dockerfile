# syntax=docker/dockerfile:1.7

FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY lib ./lib
RUN bun install --frozen-lockfile

COPY tsconfig.json styles.css index.tsx ./
COPY public ./public
COPY src ./src
RUN bun run build


FROM oven/bun:1-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --chown=bun:bun drizzle ./drizzle

USER bun
EXPOSE 3000
CMD ["bun", "dist/index.js"]
