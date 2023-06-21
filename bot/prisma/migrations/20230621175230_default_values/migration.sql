-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "messages" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("avatarURL", "discordUserId", "discriminator", "id", "messages", "username", "xp") SELECT "avatarURL", "discordUserId", "discriminator", "id", "messages", "username", "xp" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_discordUserId_key" ON "User"("discordUserId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
