FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json ./
COPY bun.lock* ./
RUN bun install

COPY . .
COPY public ./public

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]