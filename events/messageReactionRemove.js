const Discord = require('discord.js');
const names = ['messageReactionRemove'];
const fs = require('fs');

/**
 * @param {Discord.Client} client
 * @param {Discord.MessageReaction} reaction
 * @param {Discord.User} user
 */
function execute(client, reaction, user) {
  console.log(`${user.tag} removed reaction ${reaction.emoji.name} from message ${reaction.message.id} by ${reaction.message.author.tag}`);
  fs.writeFileSync("./random_log.txt", fs.readFileSync("./random_log.txt", "utf8") + `${user.tag} removed reaction ${reaction.emoji.name} from message ${reaction.message.id} by ${reaction.message.author.tag}\n`);
}

module.exports = { names, execute };