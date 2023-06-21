-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linked" BOOLEAN NOT NULL DEFAULT false,
    "ping" BOOLEAN NOT NULL DEFAULT false,
    "fastestSpeedrun" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Config" ("fastestSpeedrun", "id", "linked", "ping", "userId") SELECT "fastestSpeedrun", "id", coalesce("linked", false) AS "linked", coalesce("ping", false) AS "ping", "userId" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
