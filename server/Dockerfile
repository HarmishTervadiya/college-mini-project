FROM oven/bun:1 AS base

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

EXPOSE 3001
CMD ["bun", "run", "src/server.ts"]
