import { Awaitable, Events, Message, WebhookClient } from "discord.js";
import { DuckClient, DuckEvent } from "../types";
import config from "../config.json";

const MessageCreateEvent: DuckEvent<Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (
      message.author.bot ||
      message.system ||
      !message.inGuild() ||
      message.guildId != config.botServerID
    )
      return;

    let client = message.client as DuckClient;
    let prisma = client.prismaClient;
    let discordUser = message.author;

    // TODO: Move database code to it's own file

    let user = await prisma.user.findUnique({
      where: {
        discordUserId: discordUser.id,
      },
      include: {
        config: true,
      },
    });

    if (user == null) {
      user = await prisma.user.create({
        data: {
          discordUserId: discordUser.id,
          username: discordUser.username,
          discriminator: discordUser.discriminator,
          avatarURL: discordUser.avatarURL({ forceStatic: true })!,
          config: {
            create: {},
          },
        },
        include: {
          config: true,
        },
      });
    }

    if (user == null) {
      console.log(`Problem creating database entry for ${discordUser.tag}`);
      const webhookClient = new WebhookClient({ url: config.errorWebhookUrl });
      webhookClient.send({
        content: `ERROR: Failed to create database entry for ${discordUser.tag}`,
      });
      webhookClient.destroy();
      return;
    }

    let newMessageTotal = user.messages + 1;
    let multiplier = 1;

    config.multipliers.roles.forEach((role) => {
      if (message.member?.roles.cache.has(role.id)) {
        multiplier *= role.multiplier;
      }
    });

    let newXP = user.xp + Math.floor(config.baseXP * multiplier);

    const updatedUser = await prisma.user.update({
      where: {
        discordUserId: discordUser.id,
      },
      data: {
        messages: newMessageTotal,
        xp: newXP,
        username: discordUser.username, // In case they changed it
        discriminator: discordUser.discriminator, // In case they changed it
        avatarURL: discordUser.avatarURL({ forceStatic: true })!, // In case they changed it
      },
      include: {
        config: true,
      },
    });

    // TODO: Temp
    // message.reply({
    //   content: `XP: ${updatedUser.xp}\nMessages: ${
    //     updatedUser.messages
    //   }\n\nFull user:\n\`\`\`json\n${JSON.stringify(
    //     updatedUser,
    //     null,
    //     2
    //   )}\n\`\`\``,
    // });
  },
};

export default MessageCreateEvent;
