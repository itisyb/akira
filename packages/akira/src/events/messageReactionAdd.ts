import { anonymousPollPhrase } from "../commands/fun/poll";
import { Event } from "../util/registerCommandsAndEvents";
import { numericEmojis } from "../util/utilities";

export const event: Event<"messageReactionAdd"> = {
  run: async (reaction, user, _client, prisma) => {
    if (user.bot) {
      return;
    }

    if (reaction.partial) {
      await reaction.fetch();
    }

    // Extends commands/fun/poll.ts
    const numericEmojiIdx = numericEmojis.indexOf(reaction.emoji.name);
    const embeds = reaction.message.embeds;
    const embed = embeds.length ? embeds[0] : undefined;

    if (numericEmojiIdx >= 0 && embed?.footer?.text?.includes("poll")) {
      const question = await prisma.question.findOne({
        where: { id: reaction.message.id },
      });

      if (question) {
        await prisma.answer.upsert({
          where: {
            answer_user_id_question_id_key: {
              questionId: question.id,
              userId: user.id,
            },
          },
          create: {
            userId: user.id,
            answerIndex: numericEmojiIdx,
            question: {
              connect: {
                id: question.id,
              },
            },
          },
          update: { answerIndex: numericEmojiIdx },
        });

        if (question.isAnonymous) {
          await reaction.users.remove(user.id);

          const count = await prisma.answer.count({
            where: { questionId: question.id },
          });

          const voteCountPhrase = `🗳 **Total votes:** \`${count}\``;
          const formattedAnswers = question.possibleAnswers
            .map((answer, idx) => `${numericEmojis[idx]}: **${answer}**`)
            .join("\n");

          embed.setDescription(
            `${formattedAnswers}\n\n${voteCountPhrase}\n${anonymousPollPhrase}`
          );

          await reaction.message.edit(embed);
        } else {
          const prevReaction = reaction.message.reactions.cache.find(
            (messageReaction) =>
              messageReaction.users.cache.has(user.id) &&
              messageReaction.emoji.name !== reaction.emoji.name
          );

          if (prevReaction) {
            await prevReaction.users.remove(user.id);
          }
        }
      }
    }

    if (reaction.emoji.name === "✅" && embed?.footer?.text?.includes("poll")) {
      await reaction.users.remove(user.id);

      const question = await prisma.question.findOne({
        where: { id: reaction.message.id },
        include: { answers: true },
      });

      if (question && question.authorId === user.id) {
        const results = numericEmojis
          .filter((emoji) => reaction.message.reactions.cache.has(emoji))
          .map((_, idx) => {
            const answers = question.answers.filter(
              (answer) => answer.answerIndex === idx
            );

            return `**${question.possibleAnswers[idx]}**: \`${answers.length}\` vote(s)`;
          });

        await reaction.message.reactions.removeAll();

        embed.setDescription(results.join("\n"));
        embed.setFooter("This poll has ended, thank you for participating!");

        await reaction.message.edit(embed);

        await prisma.question.delete({ where: { id: question.id } });
      }
    }
    // End
  },
};
