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
        xp INTEGER
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
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row as dbUser);
        }
      );
    });
  }

  getTopUsers(): Promise<dbUser[]> {
    return new Promise((resolve, reject) => {
      this.connection.all(
        `SELECT * FROM users ORDER BY xp DESC LIMIT 10`,
        (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows as dbUser[]);
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
        `INSERT INTO users (userID, username, discriminator, avatarURL, messages, lastMessageTime, xp) VALUES (?, ?, ?, ?, 0, 0, 0)`,
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
    xp: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.run(
        `UPDATE users SET username = ?, discriminator = ?, avatarURL = ?, messages = ?, lastMessageTime = ?, xp = ? WHERE userID = ?`,
        [
          username,
          discriminator,
          avatarURL,
          messages,
          lastMessageTime.toString(),
          xp,
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

export type dbUser = {
  id: number;
  userID: string;
  username: string;
  discriminator: number;
  avatarURL: string;
  messages: number;
  lastMessageTime: string;
  xp: number;
};
