FROM oven/bun:1.2.21-alpine as builder

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile --production

COPY src ./src
COPY tsconfig.json ./
COPY drizzle.config.ts ./

FROM oven/bun:1.2.21-alpine as production

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001 && \
    chown -R bunuser:bunuser /app

USER bunuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["bun", "run", "src/index.ts"]