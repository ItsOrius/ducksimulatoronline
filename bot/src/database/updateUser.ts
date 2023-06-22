import { PrismaClient, User } from "@prisma/client";
import { User as DiscordUser } from "discord.js";

export async function updateUser(
  discordUserId: string,
  prisma: PrismaClient,
  discordUser: DiscordUser,
  totalMessages: number,
  totalXP: number,
  lastMessageTime: Date
): Promise<User> {
  const user = await prisma.user.update({
    where: {
      discordUserId,
    },
    data: {
      messages: totalMessages,
      xp: totalXP,

      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatarURL: discordUser.avatarURL({ forceStatic: true })!,
      lastMessageTime,
    },
    include: {
      config: true,
    },
  });

  return user;
}
