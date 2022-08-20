const Discord = require('discord.js');
const fs = require("fs");
const name = 'guildMemberUpdate';

/**
 * @param {Discord.Client} client 
 * @param {Discord.PartialGuildMember} oldMember 
 * @param {Discord.GuildMember} newMember 
 */
function execute(client, oldMember, newMember) {
  const db = require("../db.json");
  const { premiumRoles } = require("../config.json");
  const manager = require("../LeaderboardManager.js");
  if (!db[newMember.id]) {
    db[newMember.id] = new manager.UserProfile(newMember.user.username, newMember.user.discriminator, newMember.user.avatarURL(), 0, 0, {});
  }
  const premiumStatus = db[newMember.id].config.highestPremium || 0;
  Object.entries(premiumRoles).forEach(role => {
    if (newMember.roles.cache.has(role[0])) {
      if (premiumStatus < parseFloat(role[1])) {
        db[newMember.id].config.highestPremium = parseFloat(role[1]);
      }
    }
  });
  if (!db[newMember.id].config.highestPremium) {
    db[newMember.id].config.highestPremium = 0;
  }
  fs.writeFileSync("./db.json", JSON.stringify(db));
}

module.exports = { name, execute };