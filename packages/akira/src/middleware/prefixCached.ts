import { Middleware } from "@prisma/client";
import { Redis } from "ioredis";

export const prefixCached = (
  redis: Redis
): Middleware<{ prefix?: string }> => async (params, next) => {
  const { model, action, args } = params;
  const keys = Object.keys(args.select);
  const selectedPrefix = keys.length === 1 && keys.includes("prefix");
  const key = `${args.where.id}:prefix`;

  if (model === "GuildSettings" && action === "findOne" && selectedPrefix) {
    const prefix = await redis.get(key);

    if (prefix) {
      return { prefix };
    }
  }

  const result = await next(params);
  const value = result?.prefix ?? process.env.PREFIX;

  await redis.set(key, value, "EX", 10);

  return result;
};
