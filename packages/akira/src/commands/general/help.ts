import { MessageEmbedOptions } from "discord.js";
import { Command, commands } from "../../util/registerCommandsAndEvents";
import {
  getCommandsByCategory,
  searchCommandByName,
} from "../../util/utilities";

export const command: Command<string | undefined> = {
  description: "Shows all of my commands or info about a specific command",
  usage: "<command name?>",
  examples: [
    { usage: "", description: "Displays a list of all commands" },
    { usage: "poll", description: "Displays info about the poll command" },
  ],
  acceptsArgs: true,
  requiresArgs: false,
  validateArgs: (args) => args[0],
  async execute(message, commandName, prisma) {
    const { prefix } = (await prisma.guildSettings.findOne({
      select: { prefix: true },
      where: { id: message.guild!.id },
    })) ?? { prefix: process.env.PREFIX };

    if (commandName) {
      const command = commands.get(commandName.toLowerCase());

      if (!command) {
        const closest = searchCommandByName(commandName.toLowerCase());

        let response = `**${commandName}** is not a valid command`;

        if (closest) {
          response += `, did you mean: **${closest}**?\nYou can send \`${prefix}help ${closest}\` for more information about this command`;
        }

        return message.channel.send(response);
      }

      const { name, description, usage, examples, aliases } = command;

      const embed: MessageEmbedOptions = {
        color: "BLUE",
        author: {
          name: "Command info",
          iconURL: message.client.user!.displayAvatarURL(),
        },
        title: `${prefix}${name} ${usage}`,
        description: `\`\`\`${description}\`\`\``,
        fields: [{ name: "Examples", value: "", inline: true }],
      };

      if (aliases) {
        embed.fields!.push({
          name: "Aliases",
          value: aliases.map((alias) => `\`${alias}\``).join(" "),
          inline: true,
        });
      }

      if (examples) {
        examples
          .map(
            (example) =>
              (embed.fields![0].value += `\`${prefix}${name} ${
                example.usage
              }\`\n${example.description.toLowerCase()}`)
          )
          .join("\n\n");
      }

      return message.channel.send({ embed });
    }

    const embed: MessageEmbedOptions = {
      color: "BLUE",
      author: {
        name: "Commands list",
        iconURL: message.client.user!.displayAvatarURL(),
      },
      // @TODO: Change once website is available
      // title: "Click here for more info",
      // url: "https://example.com/",
      description: `Send \`${prefix}help <command name>\` for more information about a specific command!`,
      fields: [],
    };

    const commandsByCategory = getCommandsByCategory();

    commandsByCategory.forEach(({ category, commands }) =>
      embed.fields!.push({
        name: category,
        value: commands.map((command) => `\`${command.name}\``).join(" "),
        inline: true,
      })
    );

    return message.channel.send({ embed });
  },
};
