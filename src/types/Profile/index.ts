import { objectType } from "nexus"
import { GuildInfo } from "../GuildInfo"

export * from "./query"

export const Profile = objectType({
  name: "Profile",
  definition(t) {
    t.id("id")
    t.string("username")
    t.string("avatar")
    t.string("discriminator")
    t.string("locale")
    t.list.field("guilds", {
      type: GuildInfo,
    })
  },
})
