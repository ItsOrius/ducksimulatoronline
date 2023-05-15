import sqlite3 from "sqlite3";

/*
`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        userID TEXT UNIQUE,
        username TEXT,
        discriminator INTEGER,
        avatarURL TEXT,
        messages INTEGER,
        lastMessageTime TEXT,
        xp INTEGER,
        level INTEGER
        pingForLevelUps INTEGER
    )`
*/

export class db {
  private connection: sqlite3.Database;

  constructor() {
    this.connection = new sqlite3.Database("../../data/db.sqlite3", (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the database.");
    });
  }

  public getUser(userID: string): Promise<dbUser> {
    return new Promise((resolve, reject) => {
      this.connection.get(
        `SELECT * FROM users WHERE userID = ?`,
        userID,
        (err, row: dbUserInternal) => {
          if (err) {
            reject(err);
          }

          const user: dbUser = {
            id: row.id,
            userID: row.userID,
            username: row.username,
            discriminator: row.discriminator,
            avatarURL: row.avatarURL,
            messages: row.messages,
            lastMessageTime: row.lastMessageTime,
            xp: row.xp,
            level: row.level,
            pingForLevelUps: row.pingForLevelUps == 1,
          };

          resolve(user);
        }
      );
    });
  }

  getTopUsers(): Promise<dbUser[]> {
    return new Promise((resolve, reject) => {
      this.connection.all(
        `SELECT * FROM users ORDER BY xp DESC LIMIT 10`,
        (err, rows: dbUserInternal[]) => {
          if (err) {
            reject(err);
          }

          const users: dbUser[] = [];

          rows.forEach((row) => {
            const user: dbUser = {
              id: row.id,
              userID: row.userID,
              username: row.username,
              discriminator: row.discriminator,
              avatarURL: row.avatarURL,
              messages: row.messages,
              lastMessageTime: row.lastMessageTime,
              xp: row.xp,
              level: row.level,
              pingForLevelUps: row.pingForLevelUps == 1,
            };

            users.push(user);
          });

          resolve(users);
        }
      );
    });
  }

  public getTopUsersByPage(page: number): Promise<dbUser[]> {
    return new Promise((resolve, reject) => {
      this.connection.all(
        `SELECT * FROM users ORDER BY xp DESC LIMIT 10 OFFSET ?`,
        (page - 1) * 10,
        (err, rows: dbUserInternal[]) => {
          if (err) {
            reject(err);
          }

          const users: dbUser[] = [];

          rows.forEach((row) => {
            const user: dbUser = {
              id: row.id,
              userID: row.userID,
              username: row.username,
              discriminator: row.discriminator,
              avatarURL: row.avatarURL,
              messages: row.messages,
              lastMessageTime: row.lastMessageTime,
              xp: row.xp,
              level: row.level,
              pingForLevelUps: row.pingForLevelUps == 1,
            };

            users.push(user);
          });

          resolve(users);
        }
      );
    });
  }

  public getUserCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.connection.get(
        `SELECT COUNT(*) AS count FROM users`,
        (err, row: { count: number }) => {
          if (err) {
            reject(err);
          }

          resolve(row.count);
        }
      );
    });
  }

  public addUser(
    userID: string,
    username: string,
    discriminator: number,
    avatarURL: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.run(
        `INSERT INTO users (userID, username, discriminator, avatarURL, messages, lastMessageTime, xp, level, pingForLevelUps) VALUES (?, ?, ?, ?, 0, 0, 0, 0, 1)`,
        [userID, username, discriminator, avatarURL],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }

  public updateUser(
    userID: string,
    username: string,
    discriminator: number,
    avatarURL: string,
    messages: number,
    lastMessageTime: number,
    xp: number,
    level: number,
    pingForLevelUps: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.run(
        `UPDATE users SET username = ?, discriminator = ?, avatarURL = ?, messages = ?, lastMessageTime = ?, xp = ?, level = ?, pingForLevelUps = ? WHERE userID = ?`,
        [
          username,
          discriminator,
          avatarURL,
          messages,
          lastMessageTime.toString(),
          xp,
          level,
          pingForLevelUps ? 1 : 0,
          userID,
        ],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }

  public close(): void {
    this.connection.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Closed the database connection.");
    });
  }
}

type dbUserInternal = {
  id: number;
  userID: string;
  username: string;
  discriminator: number;
  avatarURL: string;
  messages: number;
  lastMessageTime: string;
  xp: number;
  level: number;
  pingForLevelUps: number;
};

export type dbUser = {
  id: number;
  userID: string;
  username: string;
  discriminator: number;
  avatarURL: string;
  messages: number;
  lastMessageTime: string;
  xp: number;
  level: number;
  pingForLevelUps: boolean;
};
