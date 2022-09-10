const Discord = require('discord.js');
const names = ['guildMemberAdd'];

const config = require("../config.json");

/**
 * @param {Discord.Client} client
 * @param {Discord.GuildMember} member
 */
function execute(client, member) {
  // direct message member with embed
  const embed = new Discord.MessageEmbed()
    .setTitle("Welcome to the Duck Simulator Discord Server!")
    .setThumbnail(client.guilds.cache.get(config.guildId).iconURL())
    .setColor(config.botColor)
    .setDescription(`**Thank you so much for joining our server!**\nHere's a couple of things that you can do to get started:`)
    .addFields([
      {
        name: "Get some roles!",
        value: "Use the ``/roles`` command in any channel to get a list of **roles that you're able to earn**!",
        inline: true
      },
      {
        name: "Link your account!",
        value: "Use the ``/password`` command to **receive a personal code** to use in Duck Simulator 2!",
        inline: true
      },
      {
        name: "Grind for XP!",
        value: "Talk in the server to get rewards and a **higher position** on our [custom leaderboard](https://ducksimulator.com/leaderboard)!",
        inline: true
      },
      {
        name: "See how fast people can speedrun the game!",
        value: "Check out ``#⌚speedrun-feed`` for the latest **speedrun times**!",
        inline: true
      }
    ])
    .setFooter({ text: "Sent by " + client.user.username, iconURL: client.user.avatarURL() })
    .setTimestamp();
  member.send({ embeds: [embed] });
}

module.exports = { names, execute };