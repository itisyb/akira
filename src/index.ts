import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Client } from "discord.js"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import { join } from "path"
import { __DEV__ } from "./constants"
import { loadCommandsAndEvents } from "./utilities/loadCommandsAndEvents"
import { globAsync } from "./utilities/misc"

const main = async () => {
  await i18next.use(Backend).init({
    preload: await globAsync(`${join(process.cwd(), "locales")}/**/*.json`),
    backend: {
      loadPath: join(process.cwd(), "locales", "{{lng}}", "{{ns}}.json"),
    },
  })

  const prisma = new PrismaClient({
    log: __DEV__ ? ["query"] : ["info", "warn"],
  })

  const client = new Client()

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
