const fs = require('fs');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('setname')
	.setDescription("If you've ever been Verified, you can set the name that appears in Duck Simulator 3's credits!")
  .addStringOption(option => option.setName('name').setDescription('The name to use.').setRequired(true))

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
function execute(client, interaction) {
  const db = require('../db.json');
  const premiumLevel = require("../events/guildMemberUpdate.js").getBestPremiumStatus(interaction.member);
  if (premiumLevel < 4) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription('You need to have been Verified to use this command!')
      .setColor("RED");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  const name = interaction.options.getString('name');
  db[interaction.user.id].config.name = name;
  fs.writeFileSync('./db.json', JSON.stringify(db));
  const embed = new Discord.MessageEmbed()
    .setTitle('Success')
    .setDescription(`Your name has been set to \`\`${name}\`\`!`)
    .setColor("GREEN");
  return interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };