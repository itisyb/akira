import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { ApolloServer } from "apollo-server-fastify"
import { Client, Intents } from "discord.js"
import fastify from "fastify"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import type { Context } from "nexus-plugin-prisma/dist/utils"
import { join } from "path"
import { __DEV__ } from "./constants"
import { schema } from "./schema"
import { loadCommandsAndEvents } from "./utilities/loadCommandsAndEvents"
import { logger } from "./utilities/logger"
import { globAsync } from "./utilities/misc"

const main = async () => {
  await i18next.use(Backend).init({
    preload: await globAsync(`${join(process.cwd(), "locales")}/**/*.json`),
    backend: {
      loadPath: join(process.cwd(), "locales", "{{lng}}", "{{ns}}.json"),
    },
  })

  const intents = new Intents(Intents.ALL).remove([
    "DIRECT_MESSAGE_TYPING",
    "GUILD_MESSAGE_TYPING",
  ])

  const client = new Client({
    disableMentions: "all",
    ws: { intents },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    restRequestTimeout: 60000,
  })

  const { commands, events } = await loadCommandsAndEvents({
    commandsBaseDir: join(__dirname, "commands"),
    eventsBaseDir: join(__dirname, "events"),
  })

  events.forEach(({ eventName, listenOnce, run }) => {
    client[listenOnce ? "once" : "on"](eventName, (...args) =>
      run(...args, client, commands, prisma)
    )
  })

  const prisma = new PrismaClient({
    log: __DEV__ ? ["query"] : ["info", "warn"],
  })

  const apolloServer = new ApolloServer({
    schema,
    context: (request: Omit<Context, "prisma">) => ({ ...request, prisma }),
    playground: {
      // @TODO: customize playground options
      settings: {
        "request.credentials": "same-origin",
      },
    },
    tracing: __DEV__,
  })

  fastify({ logger })
    .register(apolloServer.createHandler({ cors: false }))
    .listen(process.env.PORT ?? 4000)

  client.login(process.env.TOKEN)
}

main()
