import { PermissionString, TextChannel } from "discord.js";
import isPromise from "is-promise";
import { commands, Event } from "../util/registerCommandsAndEvents";
import { searchCommandByName } from "../util/utilities";

const formatPermission = (permissionString: PermissionString) => {
  const permission = permissionString
    .toLowerCase()
    .split("_")
    .map((str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`)
    .join(" ");

  return `\`${permission}\``;
};

export const event: Event<"message"> = {
  run: async (message, client, prisma) => {
    const { author, guild, channel, content } = message;

    if (author.bot || !guild?.available || !(channel instanceof TextChannel)) {
      return;
    }

    const clientPerms = channel.permissionsFor(client.user!);

    if (!clientPerms?.has("SEND_MESSAGES")) {
      return;
    }

    const { prefix } = (await prisma.guildSettings.findOne({
      select: { prefix: true },
      where: { id: guild.id },
    })) ?? { prefix: process.env.PREFIX };

    if (!content.startsWith(prefix)) {
      return;
    }

    const [commandName, ...args] = content.slice(prefix.length).split(/ +/);
    const command = commands.get(commandName.toLowerCase());

    if (!command) {
      // Check if commandName is a isogram
      if (!/(.).*\1/.test(commandName)) {
        return;
      }

      const closest = searchCommandByName(commandName.toLowerCase());

      let response = `**${commandName}** is not a valid command`;

      if (closest) {
        response += `, did you mean: **${closest}**?\nYou can send \`${prefix}help ${closest}\` for more information about this command`;
      }

      return message.channel.send(response);
    }

    if (command.clientPermissions) {
      const missingPerms = clientPerms.missing(command.clientPermissions);

      if (missingPerms.length) {
        return message.channel.send(
          `I am missing the following permission(s): ${missingPerms
            .map(formatPermission)
            .join(", ")}`
        );
      }
    }

    if (command.userPermissions) {
      const userPerms = channel.permissionsFor(author);
      const missingPerms = userPerms?.missing(command.userPermissions);

      if (missingPerms?.length) {
        return message.channel.send(
          `You are missing the following permission(s): ${missingPerms
            .map(formatPermission)
            .join(", ")}`
        );
      }
    }

    if (command.acceptsArgs) {
      const validatedArgs = isPromise(command.validateArgs)
        ? await command.validateArgs(args, message)
        : command.validateArgs(args, message);

      if (!validatedArgs && command.requiresArgs) {
        return message.channel.send(
          `Invalid argument(s) provided for this command, the usage would be: \`${prefix}${command.name} ${command.usage}\``
        );
      }

      return command.execute(message, validatedArgs, prisma);
    }

    return command.execute(message, args, prisma);
  },
};
