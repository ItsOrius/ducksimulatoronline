import { Events } from "discord.js";
import { DuckClient, DuckEvent } from "../types";
import config from "../config.json";

const MessageCreateEvent: DuckEvent<Events.MessageCreate> = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    //#region Early exit conditions
    if (
      message.author.bot ||
      message.system ||
      !message.inGuild() ||
      message.guildId != config.botServerID
    )
      return;
    //#endregion

    let client = message.client as DuckClient;
    let db = client.databaseConnection;

    //#region Check if user is in database
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
    //#endregion

    //#region Check for cooldown
    if (
      !(
        message.createdTimestamp - Number.parseInt(user.lastMessageTime) >=
        config.baseCooldown * 1000
      )
    )
      return;

    //#endregion

    //#region Calculate multiplier
    let multiplier = 1;

    config.multipliers.roles.forEach((roleID) => {
      if (message.member.roles.cache.has(roleID.id)) {
        multiplier *= roleID.multiplier;
      }
    });
    //#endregion

    //#region Calculate new values
    let newXP = user.xp + Math.floor(config.baseXP * multiplier);

    function getNeededXP(level: number): number {
      return Math.floor(
        config.xpPerLevelBase * config.xpPerLevelMultiplier ** level
      );
    }

    let newLevel = user.level;
    while (newXP >= getNeededXP(newLevel)) {
      newLevel++;
    }
    //#endregion

    //#region Update values
    await db.updateUser(
      message.author.id,
      message.author.username,
      Number.parseInt(message.author.discriminator),
      message.author.avatarURL(),
      user.messages + 1,
      message.createdTimestamp,
      newXP,
      newLevel,
      user.pingForLevelUps
    );
    //#endregion

    // Test code
    if (newLevel > user.level && user.pingForLevelUps) {
      message.reply(`Congratulations! You leveled up to level ${newLevel}!`);
    }
  },
};

export default MessageCreateEvent;
