import { PrismaClient, User } from "@prisma/client";
import { User as DiscordUser } from "discord.js";

export async function getUser(
  discordUserId: string,
  prisma: PrismaClient
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      discordUserId,
    },
    include: {
      config: true,
    },
  });

  return user;
}

export async function getOrCreateUser(
  discordUserId: string,
  prisma: PrismaClient,
  discordUser: DiscordUser
): Promise<User | null> {
  let user = await getUser(discordUserId, prisma);

  if (user == null) {
    user = await prisma.user.create({
      data: {
        discordUserId,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatarURL: discordUser.avatarURL({
          forceStatic: true,
        })!,
        config: {
          create: {},
        },
      },
      include: {
        config: true,
      },
    });
  }

  return user;
}
