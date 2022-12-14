const Discord = require('discord.js');
const fs = require("fs");
const names = ['guildMemberUpdate'];

/**
 * @param {Discord.GuildMember} member 
 * @returns 
 */
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
  return db[member.id].highestPremium ?? 0;
}

/**
 * @param {Discord.Client} client 
 * @param {Discord.PartialGuildMember} oldMember 
 * @param {Discord.GuildMember} newMember 
 */
function execute(client, oldMember, newMember) {
  const premiumStatus = getBestPremiumStatus(newMember);
  const db = require("../db.json");
  const config = require("../config.json");
  if (!db[newMember.id]) {
    db[newMember.id] = new manager.UserProfile(newMember.user.username, newMember.user.discriminator, newMember.user.avatarURL(), 0, 0, {});
  }
  if (premiumStatus <= db[newMember.id].highestPremium) {
    return;
  }
  if (!db[newMember.id].firstPremium && premiumStatus >= 3) {
    db[newMember.id].firstPremium = new Date();
  }
  if (premiumStatus >= 3 || (premiumStatus >= 2 && new Date() - new Date(db[newMember.id].firstPremium) >= 86400000)) {
    newMember.roles.add(newMember.guild.roles.cache.get(config.earlySupporterRole));
  }
  db[newMember.id].premiumStatus = premiumStatus;
  fs.writeFileSync("./db.json", JSON.stringify(db));
}

module.exports = { names, execute: () => {}, getBestPremiumStatus: () => {} };

//module.exports = { names, execute, getBestPremiumStatus };