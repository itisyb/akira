import { Middleware, PrismaAction } from "@prisma/client";
import Fuse from "fuse.js";
import { redis } from "../clients";
import { Command, commands } from "./registerCommandsAndEvents";

export type MaybeArray<T> = T | T[];

type CommandMap = { [category: string]: Command[] };

interface CacheMiddlewareOptions {
  model: string;
  action: PrismaAction;
  cacheSpecificDataset?: string[];
  cacheExpireTimeInSeconds?: number;
}

export const numericEmojis = [
  "1⃣",
  "2⃣",
  "3⃣",
  "4⃣",
  "5⃣",
  "6⃣",
  "7⃣",
  "8⃣",
  "9⃣",
  "🔟",
];

export const searchCommandByName = (name: string) => {
  const commandNames = [...commands.keys()];
  const fuse = new Fuse(commandNames);
  const result = fuse.search(name, { limit: 1 });

  return result.length && result[0].item;
};

export const getCommandsByCategory = () => {
  const commandMap: CommandMap = {};

  for (const command of [...commands.values()]) {
    const category = command.category ?? "?";

    if (commandMap[category]) {
      const commandInCategory = commandMap[category].some(
        (cmd) => cmd.name !== command.name
      );

      if (!commandInCategory) {
        commandMap[category].push(command);
      }
    } else {
      commandMap[category] = [command];
    }
  }

  return Object.entries(commandMap).map(([category, commands]) => ({
    category,
    commands,
  }));
};

export const cacheMiddleware = ({
  model,
  action,
  cacheSpecificDataset: cacheSpecificQuerySet,
  cacheExpireTimeInSeconds,
}: CacheMiddlewareOptions): Middleware => async (params, next) => {
  if (params.model !== model || action !== params.action) {
    return next(params);
  }

  if (cacheSpecificQuerySet) {
    const allKeysMatch = cacheSpecificQuerySet.every((key) =>
      Object.keys(params.args.select).includes(key)
    );

    if (!allKeysMatch) {
      return next(params);
    }
  }

  let result;
  const key = `${params.model}:${params.action}:${JSON.stringify(params.args)}`;

  result = await redis.hgetall(key);

  if (!Object.keys(result).length) {
    result = await next(params);
    await redis.hmset(key, result);

    if (cacheExpireTimeInSeconds) {
      redis.expire(key, cacheExpireTimeInSeconds);
    }
  }

  return result;
};
