import pino from "pino"
import { __DEV__ } from "../constants"

export const logger = pino({
  name: process.env.npm_package_name,
  ...(__DEV__ && {
    prettyPrint: {
      colorize: true,
      ignore: "hostname,pid",
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
    },
  }),
})
