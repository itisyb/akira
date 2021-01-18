import ecsFormat from "@elastic/ecs-pino-format"
import pino from "pino"
import pinoElastic from "pino-elasticsearch"
import { __DEV__ } from "../constants"

ecsFormat()

const streamToElastic = () => {
  return pinoElastic({
    consistency: "one",
    node: process.env.BONSAI_URL,
    "es-version": 7,
  })
}

const prettyPrint = {
  colorize: true,
  ignore: "hostname,pid",
  translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
}

export const logger = pino(
  {
    name: process.env.npm_package_name,
    ...(__DEV__ ? { prettyPrint } : ecsFormat),
  },
  !__DEV__ && streamToElastic()
)
