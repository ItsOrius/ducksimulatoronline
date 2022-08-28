const Discord = require('discord.js');
const names = ['messageReactionRemove'];

/**
 * @param {Discord.Client} client
 * @param {Discord.MessageReaction} reaction
 * @param {Discord.User} user
 */
function execute(client, reaction, user) {
  console.log(`${user.tag} removed reaction ${reaction.emoji.name} from message ${reaction.message.id} by ${reaction.message.author.tag}`);
}

module.exports = { names, execute };