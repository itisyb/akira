import { PrismaClient } from "@prisma/client";
import { Client, Intents } from "discord.js";
import "dotenv/config";
import {
  events,
  registerCommandsAndEvents,
} from "./util/registerCommandsAndEvents";

const main = async () => {
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

  const prismaClient = new PrismaClient({
    ...(process.env.NODE_ENV === "development" && { log: ["query"] }),
  });

  events.forEach(({ eventName, emitOnce, run }) =>
    client[emitOnce ? "once" : "on"](eventName!, (...args) =>
      run(...args, client, prismaClient)
    )
  );

  client.login(process.env.TOKEN);
};

main();
