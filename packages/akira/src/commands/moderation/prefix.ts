import { Command } from "../../util/registerCommandsAndEvents";

export const command: Command<string | undefined> = {
  description: "Get or change the current prefix",
  usage: "<new prefix?>",
  examples: ["-", "/", "$"],
  acceptsArgs: true,
  requiresArgs: false,
  userPermissions: ["MANAGE_GUILD"],
  validateArgs: (args) => args[0],
  async execute(message, newPrefix, db) {
    const { prefix } = (await db.guildSettings.findOne({
      select: { prefix: true },
      where: { id: message.guild!.id },
    })) ?? { prefix: process.env.PREFIX };

    if (!newPrefix) {
      return message.channel.send(`The current prefix is ${prefix}`);
    }

    if (newPrefix === prefix) {
      return message.channel.send(
        "You attempted to set the prefix to what it was already"
      );
    }

    await db.guildSettings.upsert({
      where: { id: message.guild!.id },
      create: {
        id: message.guild!.id,
        prefix: newPrefix,
        updatedBy: message.author.id,
        action: `Set prefix to "${newPrefix}"`,
      },
      update: { prefix: newPrefix },
    });

    if (newPrefix === process.env.PREFIX) {
      return message.channel.send(
        `The prefix was reset to ${process.env.PREFIX}`
      );
    }

    return message.channel.send(
      `Successfully changed the prefix to ${newPrefix}`
    );
  },
};
