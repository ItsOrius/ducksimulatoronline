// // File to create the database and tables if they don't exist

// import sqlite3 from "sqlite3";

// // Connect (and create) the database
// let db = new sqlite3.Database("../../data/db.sqlite3", (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Connected to the database.");
// });

// // Create the users table
// db.run(
//   `CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY,
//         userID TEXT UNIQUE,
//         username TEXT,
//         discriminator INTEGER,
//         avatarURL TEXT,
//         messages INTEGER,
//         xp INTEGER
//     )`,
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log("Created users table.");
//   }
// );

// // Add test users
// /*
// {userID: "643945264868098049", username: "discord", discriminator: 0, avatarURL: "https://cdn.discordapp.com/avatars/643945264868098049/c6a249645d46209f337279cd2ca998c7.png"}
// {userID: "1", username: "Clyde", discriminator: 0, avatarURL: "https://discord.com/assets/18126c8a9aafeefa76bbb770759203a9.png"}
// */
// db.run(
//   `INSERT INTO users (userID, username, discriminator, avatarURL, messages, xp) VALUES ("643945264868098049", "discord", 0, "https://cdn.discordapp.com/avatars/643945264868098049/c6a249645d46209f337279cd2ca998c7.png", 0, 0)`,
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log("Added test user 1.");
//   }
// );
// db.run(
//   `INSERT INTO users (userID, username, discriminator, avatarURL, messages, xp) VALUES ("1", "Clyde", 0, "https://discord.com/assets/18126c8a9aafeefa76bbb770759203a9.png", 0, 0)`,
//   (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log("Added test user 2.");
//   }
// );

// // Close the database
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log("Closed the database connection.");
// });

// File to create the database and tables if they don't exist

import sqlite3 from "sqlite3";

// Connect (and create) the database
let db = new sqlite3.Database("../../data/db.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
});

// Create the users table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        userID TEXT UNIQUE,
        username TEXT,
        discriminator INTEGER,
        avatarURL TEXT,
        messages INTEGER,
        xp INTEGER
    )`,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Created users table.");
      // Add test users
      db.run(
        `INSERT INTO users (userID, username, discriminator, avatarURL, messages, xp) VALUES ("643945264868098049", "discord", 0, "https://cdn.discordapp.com/avatars/643945264868098049/c6a249645d46209f337279cd2ca998c7.png", 0, 0)`,
        (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log("Added test user 1.");
          }
        }
      );
      db.run(
        `INSERT INTO users (userID, username, discriminator, avatarURL, messages, xp) VALUES ("1", "Clyde", 0, "https://discord.com/assets/18126c8a9aafeefa76bbb770759203a9.png", 0, 0)`,
        (err) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log("Added test user 2.");
          }
        }
      );
    }
  }
);

// Close the database
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the database connection.");
});
