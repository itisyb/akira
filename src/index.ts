import "dotenv/config"
import "make-promises-safe"
import fastifySession from "@mgcrea/fastify-session"
import RedisStore from "@mgcrea/fastify-session-redis-store"
import { PrismaClient } from "@prisma/client"
import { ApolloServer } from "apollo-server-fastify"
import { Client, Intents } from "discord.js"
import fastify from "fastify"
import fastifyCookie from "fastify-cookie"
import fastifyCors from "fastify-cors"
import fastifyPassport from "fastify-passport"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import Redis from "ioredis"
import type { Context } from "nexus-plugin-prisma/dist/utils"
import { Strategy, Profile } from "passport-discord"
import { join } from "path"
import { COOKIE_NAME, SESSION_TTL, __DEV__ } from "./constants"
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

  fastifyPassport.registerUserSerializer<Profile, Profile>(async user => user)

  fastifyPassport.registerUserDeserializer<Profile, Profile>(async user => user)

  fastifyPassport.use(
    new Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/auth/discord/callback`,
        scope: ["identify", "guilds"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        return done(undefined, profile)
      }
    )
  )

  fastify({ logger })
    .register(fastifyCors, {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
    .register(fastifyCookie)
    .register(fastifySession, {
      cookieName: COOKIE_NAME,
      store: new RedisStore({
        client: new Redis(process.env.REDIS_URL),
        ttl: SESSION_TTL,
      }),
      cookie: {
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: true,
        maxAge: SESSION_TTL,
        sameSite: "lax",
        secure: true,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
    })
    .register(fastifyPassport.initialize())
    .register(fastifyPassport.secureSession())
    .register(apolloServer.createHandler({ cors: false }))
    .get(
      "/auth/discord",
      {
        preValidation: fastifyPassport.authenticate("discord"),
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      async () => {}
    )
    .get(
      "/auth/discord/callback",
      {
        preValidation: fastifyPassport.authenticate("discord"),
      },
      async (_request, reply) => reply.send("You may now close this window.")
    )
    .listen(process.env.PORT ?? 4000)

  client.login(process.env.TOKEN)
}

main()
