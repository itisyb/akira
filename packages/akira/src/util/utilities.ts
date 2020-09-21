import Fuse from "fuse.js";
import { Command, commands } from "./registerCommandsAndEvents";

type CommandMap = { [category: string]: Command[] };

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
