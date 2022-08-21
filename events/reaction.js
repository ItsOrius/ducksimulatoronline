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
  message.awaitReactions().then(collected => {
    const reactions = collected.array();
    const yesReaction = reactions.find(reaction => reaction.emoji.name == "⬆️");
    const noReaction = reactions.find(reaction => reaction.emoji.name == "⬇️");
    const ratio = yesReaction.count / (yesReaction.count + noReaction.count);
    if (ratio > 0.5) {
      reaction.message.edit({ embeds: [{ title: message.embeds[0].title, description: message.embeds[0].description, color: "GREEN", image: message.embeds[0].image.url }] });
    } else if (ratio < 0.5) {
      reaction.message.edit({ embeds: [{ title: message.embeds[0].title, description: message.embeds[0].description, color: "RED", image: message.embeds[0].image.url }] });
    } else {
      reaction.message.edit({ embeds: [{ title: message.embeds[0].title, description: message.embeds[0].description, color: config.botColor, image: message.embeds[0].image.url }] });
    }
  });
}

module.exports = { names, execute };