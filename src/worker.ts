import "dotenv/config"
import { Intents, Client } from "discord.js"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import { join } from "path"
import { prisma } from "./prisma"
import { loadCommandsAndEvents } from "./utilities/loadCommandsAndEvents"
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
    "GUILD_PRESENCES",
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

  client.login(process.env.TOKEN)
}

main()
