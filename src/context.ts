import type { PrismaClient } from "@prisma/client"
import type { FastifyRequest, FastifyReply } from "fastify"

export interface Context {
  request: FastifyRequest
  reply: FastifyReply
  prisma: PrismaClient
}
