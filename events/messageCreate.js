const Discord = require('discord.js');
const name = 'messageCreate';

const lastMessages = {}

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} msg 
 */
function execute(client, msg) {
  if (msg.author.bot) return;
  const config = require("../config.json");
  if (msg.channel.id == config.suggestionsChannel) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Suggestion #" + (msg.channel.messageCount + 1))
      .setDescription(msg.content)
      .setColor(config.botColor)
      .setFooter({ text: "Suggested by " + msg.author.tag + " | User ID: " + msg.author.id, iconURL: msg.author.displayAvatarURL() });
    msg.delete();
    msg.channel.send({ embeds: [embed] }).then(message => {
      message.react("⬆️").then(() => message.react("⬇️"));
    }).catch(console.error);
  }
  const lastMessage = lastMessages[msg.author.id] != null ? lastMessages[msg.author.id] : 0;
  lastMessages[msg.author.id] = msg;
  // if author's last message was less than 10 seconds ago, return
  if (lastMessage.createdTimestamp > msg.createdTimestamp - 5000) {
    return;
  }
  // if last message is identical to new message, return
  if (msg.content == lastMessage.content) {
    return;
  }
  const leaderboard = require('../LeaderboardManager');
  leaderboard.registerMessage(msg)
}

module.exports = { name, execute };