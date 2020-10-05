import { ApolloServer } from "apollo-server-fastify";
import fastify from "fastify";
import { prisma } from "./clients";
import { schema } from "./graphql/schema";

export const apolloServer = new ApolloServer({
  schema,
  context: { prisma },
  tracing: process.env.NODE_ENV === "development",
});

export const server = fastify({
  logger: process.env.NODE_ENV === "development",
});
