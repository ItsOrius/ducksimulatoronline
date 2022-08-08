const Discord = require('discord.js');
const fs = require("fs");

const pathname = __dirname + "/db.json";

class UserProfile {
  /**
   * @param {string} username 
   * @param {number} discriminator
   * @param {string} avatarURL 
   * @param {number} messages 
   * @param {number} xp
   * @param {object} config
   */
  constructor(username, discriminator, avatarURL, messages = 0, xp = 0, config = {}) {
    this.username = username;
    this.discriminator = discriminator;
    this.avatarURL = avatarURL;
    this.messages = messages;
    this.xp = xp;
    this.config = config;
  }
}

/**
 * @returns object
 */
function getDatabase() {
  return JSON.parse(fs.readFileSync(pathname, "utf8"));
}

/**
 * @param {Discord.Message} msg
 */
function registerMessage(msg) {
  // get multiplier
  let { xpMultiplier } = require("./config.json");
  // get database
  const db = getDatabase();
  // apply role multipliers from config
  const { roleMultipliers, levelRoles } = require("./config.json");
  for (let [roleId, multiplier] of Object.entries(roleMultipliers)) {
    if (msg.member.roles.cache.has(roleId)) {
      xpMultiplier *= multiplier;
    }
  }
  // generate random xp amount between 1 and 5
  const xp = Math.floor(Math.random() * 5 * xpMultiplier) + 1;
  // save old level
  let oldLevel = 0;
  // get user
  const user = msg.author;
  // create new user object if it doesn't exist, otherwise modify
  if (!db[user.id]) {
    db[user.id] = new UserProfile(user.username, user.discriminator, user.avatarURL(), 1, xp);
  } else {
    oldLevel = getLevel(db[user.id].xp)
    db[user.id] = new UserProfile(user.username, user.discriminator, user.avatarURL(), db[user.id].messages + 1, db[user.id].xp + xp, db[user.id].config);
  }
  // update database
  fs.writeFileSync(pathname, JSON.stringify(db));
  // check if user has leveled up
  const newLevel = getLevel(db[user.id].xp);
  if (newLevel > oldLevel) {
    if (getShouldPingUser(user)) {
      // reply to msg with level up message
      msg.reply({ content: `Congratulations, ${user.toString()}! You've leveled up to level ${newLevel}!\n**P.S.** You can disable this message at any time by running \`\`/ping off\`\`.` });
    }
    console.log(`${user.tag} (${user.id}) has leveled up to level ${newLevel}!`);
    Object.entries(levelRoles).forEach(obj => {
      if (newLevel >= obj[0]) {
        if (!msg.member.roles.cache.has(obj[1])) {
          const newRole = msg.member.guild.roles.cache.get(obj[1])
          msg.member.roles.add(newRole)
          msg.reply({ content: `Congratulations, ${user.toString()}! You just earned the \`\`${newRole.name}\`\` role!` })
          console.log(`${user.tag} (${user.id}) has unlocked the ${newRole.name} role!`)
        }
      }
    })
  }
}

/**
 * @param {number} xp
 * @returns number
 */
function getLevel(xp) {
  let level = 0;
  let stop = false;
  while (!stop) {
    if (xp >= Math.floor((5 * ((1.5) ** (level + 1))))) {
      level++;
    } else {
      stop = true;
    }
  }
  return level;
}

/**
 * @param {number} level 
 * @returns number
 */
function getNeededXp(level) {
  return Math.floor(5 * ((1.5) ** (level)));
}

function getOrderedUsers() {
  // get database
  const db = getDatabase();
  // sort database by user's xp, include user's id
  const sorted = Object.entries(db).sort((a, b) => b[1].xp - a[1].xp);
  // get user's rank
  const users = sorted.map(([key, value]) => {
    const rank = sorted.findIndex(([k, v]) => k === key) + 1;
    return {
      rank,
      id: key
    };
  });
  return users;
}

/**
 * @param {number} id
 * @returns number
 */
function getRank(id) {
  // find user in ordered users
  const users = getOrderedUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return i + 1;
    }
  }
}

/**
 * @param {Discord.User} user
 * @returns boolean
 */
function getShouldPingUser(user) {
  const db = getDatabase();
  if (!db[user.id]) {
    db[user.id] = new UserProfile(user.username, user.discriminator, user.avatarURL());
  }
  if (db[user.id].config.ping == null) {
    return false;
  }
  return db[user.id].config.ping;
}

/**
 * @param {Discord.Interaction} interaction
 * @param {boolean} value
 */
function setShouldPingUser(interaction, value) {
  const db = getDatabase();
  const user = interaction.user;
  if (!db[user.id]) {
    db[user.id] = new UserProfile(user.username, user.discriminator, user.avatarURL());
  }
  db[user.id].config.ping = value;
  fs.writeFileSync(pathname, JSON.stringify(db));
  if (value) {
    return interaction.reply({ content: `You will now be pinged when you level up!`, ephemeral: true });
  }
  return interaction.reply({ content: `You will no longer be pinged when you level up!`, ephemeral: true });
}

/**
 * @param {number} id 
 * @returns object
 */
function getUserProfile(id) {
  const db = getDatabase();
  const user = db[id];
  if (!user) {
    return null;
  }
  user.level = getLevel(user.xp);
  user.nextLevelXp = getNeededXp(user.level + 1);
  return user;
}

module.exports = { registerMessage, getLevel, getRank, getOrderedUsers, setShouldPingUser, getUserProfile, getNeededXp, UserProfile };