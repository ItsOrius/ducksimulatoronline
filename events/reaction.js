const Discord = require('discord.js');
const names = ["messageReactionAdd", "messageReactionRemove"];

/**
 * @param {Discord.Client} client
 * @param {Discord.PartialMessageReaction} reaction
 * @param {Discord.User} user
 */
function execute(client, reaction, user) {
  const config = require('../config.json');
  if (reaction.message.channelId != config.suggestionsChannel) return;
  if (user.id == client.user.id) return;
  const message = reaction.message;
  const reactions = message.reactions.cache;
  const yesReaction = reactions.get("⬆️");
  const noReaction = reactions.get("⬇️");;
  const ratio = reactions.get(yesReaction.emoji.id).count / reactions.get(noReaction.emoji.id).count
  if (ratio > 1) {
    reaction.message.edit({ embeds: [{ title: message.embeds[0].title, description: message.embeds[0].description, color: "GREEN", image: message.embeds[0].image.url }] });
  } else if (ratio < 1) {
    reaction.message.edit({ embeds: [{ title: message.embeds[0].title, description: message.embeds[0].description, color: "RED", image: message.embeds[0].image.url }] });
  } else {
    reaction.message.edit({ embeds: [{ title: message.embeds[0].title, description: message.embeds[0].description, color: config.botColor, image: message.embeds[0].image.url }] });
  }
}

module.exports = { names, execute };