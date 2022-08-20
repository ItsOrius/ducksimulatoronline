const Discord = require('discord.js');
const fs = require("fs");
const name = 'guildMemberUpdate';

function getBestPremiumStatus(member) {
  const db = require("../db.json");
  const { premiumRoles } = require("../config.json");
  const manager = require("../LeaderboardManager.js");
  if (!db[member.id]) {
    db[member.id] = new manager.UserProfile(member.user.username, member.user.discriminator, member.user.avatarURL(), 0, 0, {});
  }
  const premiumStatus = db[member.id].highestPremium || 0;
  Object.entries(premiumRoles).forEach(role => {
    if (member.roles.cache.has(role[0])) {
      if (premiumStatus < parseFloat(role[1])) {
        db[member.id].highestPremium = parseFloat(role[1]);
      }
    }
  });
  if (!db[member.id].highestPremium) {
    db[member.id].highestPremium = 0;
  }
  return db[member.id].highestPremium;
}

/**
 * @param {Discord.Client} client 
 * @param {Discord.PartialGuildMember} oldMember 
 * @param {Discord.GuildMember} newMember 
 */
function execute(client, oldMember, newMember) {
  const premiumStatus = getBestPremiumStatus(newMember);
  const db = require("../db.json");
  if (!db[member.id]) {
    db[member.id] = new manager.UserProfile(member.user.username, member.user.discriminator, member.user.avatarURL(), 0, 0, {});
  }
  if (premiumStatus <= db[member.id].highestPremium) {
    return;
  }
  db[newMember.id].premiumStatus = premiumStatus;
  fs.writeFileSync("./db.json", JSON.stringify(db));
}

module.exports = { name, execute, getBestPremiumStatus };