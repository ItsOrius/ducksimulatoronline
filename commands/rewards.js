const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('rewards')
	.setDescription('Sends a list of all unlockable rewards!')

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
function execute(client, interaction) {
  const config = require("../config.json");
  const gameRewards = {
    "``1000 XP``": "Link your account through Duck Simulator 2!",
    "<@&933470435901841478>": "Complete Duck Simulator 2 in any way!",
    "<@&1001312314038951976>": "Speedrun Duck Simulator 2 in under ten minutes!",
    "<@&949901792177700874>": "Complete the true ending of Duck Simulator 2!"
  };
  const levelRoles = [];
  Object.entries(config.levelRoles).forEach(element => {
    levelRoles.push(`**Level ${element[0]}:** <@&${element[1]}>`);
  });
  const embed = new Discord.MessageEmbed()
    .setTitle("Rewards")
    .setDescription("These are all of the currently unlockable rewards!")
    .setColor(config.botColor)
    .addFields([
      {
        name: "Game Rewards",
        value: Object.entries(gameRewards).map(element => `${element[0]}: ${element[1]}`).join("\n"),
      },
      {
        name: "Level Roles",
        value: levelRoles.join("\n")
      }
    ]);
  interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };