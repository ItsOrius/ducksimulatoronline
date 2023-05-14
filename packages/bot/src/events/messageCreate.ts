import { Events } from "discord.js";
import { DuckClient, DuckEvent } from "../types";
import config from "../config.json";

const XP_INCREMENT = 10;

const MessageCreateEvent: DuckEvent<Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (
      message.author.bot ||
      message.system ||
      !message.inGuild() ||
      message.guildId != config.botServerID.toString()
    )
      return;

    let client = message.client as DuckClient;
    let db = client.databaseConnection;

    let user = await db.getUser(message.author.id);
    if (!user) {
      await db.addUser(
        message.author.id,
        message.author.username,
        Number.parseInt(message.author.discriminator),
        message.author.avatarURL()
      );
      user = await db.getUser(message.author.id);
    }
    await db.updateUser(
      message.author.id,
      message.author.username,
      Number.parseInt(message.author.discriminator),
      message.author.avatarURL(),
      user.messages++,
      message.createdTimestamp,
      (user.xp += XP_INCREMENT)
    );

    user = await db.getUser(message.author.id);
    message.reply("```json\n" + JSON.stringify(user, null, 2) + "\n```");
  },
};

export default MessageCreateEvent;
