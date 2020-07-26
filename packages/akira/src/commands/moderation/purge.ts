import { Command } from "../../util/registerCommandsAndEvents";

export const command: Command<number> = {
  description:
    "Delete up to 100 messages at a time (excluding pinned messages)",
  aliases: ["delete", "nuke"],
  usage: "<amount>",
  examples: ["25", "50", "100"],
  acceptsArgs: true,
  requiresArgs: true,
  clientPermissions: ["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"],
  userPermissions: ["MANAGE_MESSAGES"],
  validateArgs: (args) => {
    const amount = Number(args[0]);

    return isNaN(amount) ? undefined : amount;
  },
  async execute(message, amount) {
    if (amount < 5 || amount > 100) {
      return message.reply(
        "please provide at least 5 messages with a maximum of 10"
      );
    }

    let messages = await message.channel.messages.fetch({ limit: amount });

    messages = messages.filter((msg) => !msg.pinned);

    try {
      const collection = await message.channel.bulkDelete(messages, true);

      const response = await message.channel.send(
        `Successfully deleted \`${collection.size}/${amount}\` message(s), messages older than 14 days cannot be removed by bots`
      );

      return response.delete({ timeout: 10000 });
    } catch (error) {
      return message.channel.send(
        `Error trying to delete messages:\n\n\`${error.message}\``
      );
    }
  },
};
