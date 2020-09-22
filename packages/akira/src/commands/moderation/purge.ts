import { Command } from "../../util/registerCommandsAndEvents";

export const command: Command<number> = {
  description:
    "Delete up to 100 messages at a time (excluding pinned messages)",
  aliases: ["delete", "nuke"],
  usage: "<amount>",
  examples: [{ usage: "25", description: "Deletes 25 messages" }],
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

      let response = `Successfully deleted \`${collection.size}/${amount}\` message(s)`;

      if (collection.size < amount) {
        response +=
          ". Pinned messages are ignored. Messages older than 14 days cannot be removed by bots";
      }

      const sentMessage = await message.channel.send(response);

      await sentMessage.delete({ timeout: 10000 });

      return;
    } catch (error) {
      return message.channel.send(
        `There was an error attempting to delete messages: \`${error.message}\``
      );
    }
  },
};
