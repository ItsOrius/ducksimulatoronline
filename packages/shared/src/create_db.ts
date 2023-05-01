// File to create the database and tables if they don't exist

import sqlite3 from "sqlite3";

let db = new sqlite3.Database("../../data/db.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

db.run(
  `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        userID INTEGER UNIQUE,
        username TEXT,
        discriminator INTEGER,
        avatarURL TEXT,
        messages INTEGER,
        xp INTEGER
    )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Created users table.");
  }
);

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the database connection.");
});
