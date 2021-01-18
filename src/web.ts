import "dotenv/config"
import "make-promises-safe"
import fastifySession from "@mgcrea/fastify-session"
import RedisStore from "@mgcrea/fastify-session-redis-store"
import { ApolloServer } from "apollo-server-fastify"
import fastify from "fastify"
import fastifyCookie from "fastify-cookie"
import fastifyCors from "fastify-cors"
import fastifyPassport from "fastify-passport"
import { applyMiddleware } from "graphql-middleware"
import Redis from "ioredis"
import Strategy, { Profile } from "passport-discord"
import { __DEV__, COOKIE_NAME, SESSION_TTL } from "./constants"
import type { Context } from "./context"
import { permissions } from "./permissions"
import { prisma } from "./prisma"
import { schema } from "./schema"
import { logger } from "./utilities/logger"

const main = async () => {
  const apolloServer = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    context: (request: Omit<Context, "prisma">) => ({ ...request, prisma }),
    playground: {
      // @TODO: customize playground options
      settings: {
        "request.credentials": "same-origin",
      },
    },
    tracing: __DEV__,
  })

  fastifyPassport.registerUserSerializer<Profile, Profile>(
    async profile => profile
  )

  fastifyPassport.registerUserDeserializer<Profile, Profile>(
    async profile => profile
  )

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
    .listen(process.env.PORT ?? 4000, "0.0.0.0")
}

main()
