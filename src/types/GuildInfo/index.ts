import { objectType } from "nexus"

export const GuildInfo = objectType({
  name: "GuildInfo",
  definition(t) {
    t.id("id")
    t.string("name")
    t.string("icon")
    t.int("permissions")
  },
})
