const Discord = require('discord.js');
const name = 'guildMemberAdd';

const passwordCommand = require('../commands/password.js');

/**
 * @param {Discord.Client} client
 * @param {Discord.GuildMember} member
 */
function execute(client, member) {
  // direct message member with password
  const channel = member.user.dmChannel || member.user.createDM();
  const password = passwordCommand.generatePassword(member.id);
  //channel.send({ content: `**Welcome to the official Duck Simulator server!**\nYour personal password is ||${password}||. **DO NOT SHARE THIS WITH ANYONE ELSE!**` });
}

module.exports = { name, execute };