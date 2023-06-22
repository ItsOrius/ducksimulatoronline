import { PrismaClient, User } from "@prisma/client";
import { getUser } from "./getUser";

export async function deleteUser(
  discordUserId: string,
  prisma: PrismaClient
): Promise<void> {
  const prismaUser = await getUser(discordUserId, prisma);

  if (prismaUser == null) return;

  const deleteConfig = prisma.config.deleteMany({
    where: {
      userId: prismaUser.id,
    },
  });

  const deleteUser = prisma.user.delete({
    where: {
      id: prismaUser.id,
    },
  });

  const transaction = await prisma.$transaction([deleteConfig, deleteUser]);
}
