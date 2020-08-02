import { Command } from "../../util/registerCommandsAndEvents";

export const command: Command<string> = {
  description: "Get a answer to your yes-no question",
  usage: "<question>",
  examples: [
    {
      usage: "Should I start studying?",
      description: "Answers your question",
    },
  ],
  acceptsArgs: true,
  requiresArgs: true,
  validateArgs: (args) => args.join(" "),
  async execute(message, question) {
    if (!question.endsWith("?")) {
      return message.channel.send(
        "Please make sure your question ends with a question mark"
      );
    }

    // https://en.wikipedia.org/wiki/Magic_8-Ball
    const possibleAnswers = [
      // Affirmative
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes – definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",

      // Non-committal
      "Reply hazy, try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",

      // Negative
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
    ];

    const answer =
      possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];

    return message.channel.send(answer);
  },
};
