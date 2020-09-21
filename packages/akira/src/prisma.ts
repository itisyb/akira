import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  ...(process.env.NODE_ENV === "development" && { log: ["query"] }),
});
