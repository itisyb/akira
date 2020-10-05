import { PrismaClient } from "@prisma/client";
import { Client, Intents } from "discord.js";
import Redis from "ioredis";

const intents = new Intents(Intents.ALL).remove([
  "DIRECT_MESSAGE_TYPING",
  "GUILD_MESSAGE_TYPING",
]);

export const client = new Client({
  disableMentions: "all",
  ws: { intents },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  restRequestTimeout: 60000,
});

export const prisma = new PrismaClient({
  ...(process.env.NODE_ENV === "development" && { log: ["query"] }),
});

export const redis = new Redis(process.env.REDIS_URL);
