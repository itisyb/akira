import type { Profile } from "passport-discord"

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PassportUser extends Profile {}
}
