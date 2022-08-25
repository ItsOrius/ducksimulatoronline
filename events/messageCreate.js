const Discord = require('discord.js');
const request = require('request');
const path = require('path');
const fs = require('fs');
const names = ['messageCreate'];

const lastMessages = {}

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} msg 
 */
function execute(client, msg) {
  if (msg.author.bot) return;
  const config = require("../config.json");
  const channels = config.suggestionsChannels;
  let isSuggestion = false;
  for (let i = 0; i < channels.length; i++) {
    if (msg.channel.id == channels[i].id) {
      isSuggestion = i;
      break;
    }
  }
  if (isSuggestion != false) {
    const embed = new Discord.MessageEmbed()
      .setTitle(channels[i].title)
      .setDescription(msg.content)
      .setColor(config.botColor)
      .setFooter({ text: "Suggested by " + msg.author.tag + " | User ID: " + msg.author.id, iconURL: msg.author.displayAvatarURL() });
    if (msg.attachments.size > 0) {
      if (!fs.existsSync(path.join(__dirname, `../website/uploads/${msg.author.id}`))) {
        fs.mkdirSync(path.join(__dirname, `../website/uploads/${msg.author.id}`), { recursive: true });
      }
      const filePath = path.join(__dirname, "../website/uploads/" + msg.author.id + "/" + msg.id + ".png");
      request(msg.attachments.first().url).pipe(fs.createWriteStream(filePath)).on("close", () => {
        embed.setImage(`https://${config.domain}/uploads/${msg.author.id}/${msg.id}.png`);
        msg.delete();
        msg.channel.send({ embeds: [embed] }).then(message => {
          message.react("⬆️").then(() => message.react("⬇️"));
        }).catch(console.error);
      });
    } else {
      msg.delete();
      if (!channels[i].requiresImage) {
        msg.channel.send({ embeds: [embed] }).then(message => {
          message.react("⬆️").then(() => message.react("⬇️"));
        }).catch(console.error);
      } else {
        msg.member.send({content: "You need to attach an image with your submission!"});
        return;
      }
    }
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

module.exports = { names, execute };