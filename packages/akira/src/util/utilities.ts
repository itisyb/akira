import Fuse from "fuse.js";
import { commands } from "./registerCommandsAndEvents";

export type MaybeArray<T> = T | T[];

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
