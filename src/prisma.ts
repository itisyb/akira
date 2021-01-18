import { PrismaClient } from "@prisma/client"
import { __DEV__ } from "./constants"

export const prisma = new PrismaClient({
  log: __DEV__ ? ["query"] : ["info", "warn"],
})
