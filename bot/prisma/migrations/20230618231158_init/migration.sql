-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "messages" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linked" BOOLEAN,
    "ping" BOOLEAN,
    "fastestSpeedrun" TEXT,
    "claimer" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordUserId_key" ON "User"("discordUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");
