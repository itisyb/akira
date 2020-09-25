import { ApolloServer } from "apollo-server-fastify";
import { Client, Intents } from "discord.js";
import "dotenv/config";
import fastify from "fastify";
import "make-promises-safe";
import { prisma } from "./clients";
import { schema } from "./graphql/schema";
import { logger } from "./util/logger";
import {
  events,
  registerCommandsAndEvents,
} from "./util/registerCommandsAndEvents";
import { cacheMiddleware } from "./util/utilities";

const main = async () => {
  const apolloServer = new ApolloServer({
    schema,
    context: { prisma },
    tracing: process.env.NODE_ENV === "development",
  });

  const server = fastify({ logger: true });

  server.register(apolloServer.createHandler());

  await registerCommandsAndEvents({
    eventDir: `${__dirname}/events/*{.js,.ts}`,
    commandDir: `${__dirname}/commands/**/*{.js,.ts}`,
  });

  const intents = new Intents(Intents.ALL).remove([
    "DIRECT_MESSAGE_TYPING",
    "GUILD_MESSAGE_TYPING",
  ]);

  const client = new Client({
    disableMentions: "all",
    ws: { intents },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    restRequestTimeout: 60000,
  });

  prisma.$use(
    cacheMiddleware({
      model: "GuildSettings",
      action: "findOne",
      cacheSpecificDataset: ["prefix"],
      cacheExpireTimeInSeconds: 10,
    })
  );

  events.forEach(({ eventName, emitOnce, run }) =>
    client[emitOnce ? "once" : "on"](eventName!, (...args) =>
      run(...args, client, prisma)
    )
  );

  server.listen(4000, (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    logger.info(`server listening on ${address}`);
  });

  client.login(process.env.TOKEN);
};

main();
