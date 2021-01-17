import type { Profile } from "passport-discord"

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PassportUser extends Profile {}
}

declare module "@elastic/ecs-pino-format"

// @TODO: remove when https://github.com/pinojs/pino-elasticsearch/issues/54 has been fixed
declare module "pino-elasticsearch"
