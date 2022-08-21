const Discord = require('discord.js');
const names = ["messageReactionAdd", "messageReactionRemove"];

/**
 * @param {Discord.Client} client
 * @param {Discord.MessageReaction} reaction
 * @param {Discord.User} user
 */
async function execute(client, reaction, user) {
  await reaction.fetch();
  const config = require('../config.json');
  if (reaction.message.channelId != config.suggestionsChannel) return;
  if (user.id == client.user.id) return;
  const message = reaction.message;
  const yesReaction = message.reactions.cache.find(reaction => reaction.emoji.name == "⬆️");
  const noReaction = message.reactions.cache.find(reaction => reaction.emoji.name == "⬇️");
  const ratio = yesReaction.count / (yesReaction.count + noReaction.count);
  const embed = new Discord.MessageEmbed().setTitle("Suggestion");
  if (message.embeds[0].description) embed.setDescription(message.embeds[0].description);
  if (message.embeds[0].footer) embed.setFooter(message.embeds[0].footer);
  if (message.embeds[0].timestamp) embed.setTimestamp(message.embeds[0].timestamp);
  if (message.embeds[0].image) embed.setImage(message.embeds[0].image.url);
  if (ratio > 0.5) {
    embed.setColor("GREEN");
  } else if (ratio < 0.5) {
    embed.setColor("RED");
  } else {
    embed.setColor(config.botColor);
  }
  if (embed.color == message.embeds[0].color) return;
  reaction.message.edit({ embeds: [embed] });
}

module.exports = { names, execute };