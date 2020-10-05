import "dotenv/config";
import "make-promises-safe";
import { client, prisma } from "./clients";
import { apolloServer, server } from "./servers";
import { logger } from "./util/logger";
import {
  events,
  registerCommandsAndEvents,
} from "./util/registerCommandsAndEvents";
import { cacheMiddleware } from "./util/utilities";

const main = async () => {
  server.register(apolloServer.createHandler());

  await registerCommandsAndEvents({
    eventDir: `${__dirname}/events/*{.js,.ts}`,
    commandDir: `${__dirname}/commands/**/*{.js,.ts}`,
  });

  events.forEach(({ eventName, emitOnce, run }) =>
    client[emitOnce ? "once" : "on"](eventName!, (...args) =>
      run(...args, client, prisma)
    )
  );

  prisma.$use(
    cacheMiddleware({
      model: "GuildSettings",
      action: "findOne",
      cacheSpecificDataset: ["prefix"],
      cacheExpireTimeInSeconds: 10,
    })
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
