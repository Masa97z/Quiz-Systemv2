# ===========================
# Backend Dockerfile (NestJS + Prisma + SQLite)
# ===========================

FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json nest-cli.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx nest build

# ---- Production ----
FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /app/data

ENV DATABASE_URL="file:/app/data/quizDB.db"
ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/src/main.js"]
