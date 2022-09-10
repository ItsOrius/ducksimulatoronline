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
    .setTitle("Welcome to the official Duck Simulator Discord server!")
    .setImage(client.guilds.cache.get(config.guildId).iconURL())
    .setColor(config.botColor)
    .setDescription(`**Thank you so much for joining our server!** Here's a couple of things you can do to get started:`)
    .addFields([
      {
        name: "Get Roles",
        value: "Use the ``/roles`` command in any channel to get a list of **roles you can earn**!"
      },
      {
        name: "Link Account",
        value: "Send a message in any channel and use the ``/password`` command to **receive a personal code** to use in Duck Simulator 2!"
      },
      {
        name: "Level Up",
        value: "Talk in the server to get a **higher position** on our [custom leaderboard](https://ducksimulator.com/leaderboard)!"
      },
      {
        name: "Speedrun",
        value: "Check the ``⌚speedrun-feed`` channel for the latest **speedrun times**!"
      }
    ]);
  member.send({ embeds: [embed] });
}

module.exports = { names, execute };