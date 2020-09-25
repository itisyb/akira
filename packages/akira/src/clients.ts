import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

export const prisma = new PrismaClient({
  ...(process.env.NODE_ENV === "development" && { log: ["query"] }),
});

export const redis = new Redis(process.env.REDIS_URL);
