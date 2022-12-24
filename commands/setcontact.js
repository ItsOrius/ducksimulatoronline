const fs = require('fs');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('setcontact')
	.setDescription("If you've ever been premium, give us an alternate way to contact you for rewards when they're ready!")
  .addStringOption(option => option.setName('contact').setDescription('Tell us how to contact you, such as through a personal website or alt account.').setRequired(true))

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
function execute(client, interaction) {
  const db = require('../db.json');
  const premiumLevel = require("../events/guildMemberUpdate.js").getBestPremiumStatus(interaction.member);
  if (premiumLevel < 2 || !premiumLevel) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription('You need to have been a premium member in order to use this command!')
      .setColor("RED");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  const contact = interaction.options.getString('contact');
  db[interaction.user.id].config.contact = contact;
  fs.writeFileSync('./db.json', JSON.stringify(db));
  const embed = new Discord.MessageEmbed()
    .setTitle('Success')
    .setDescription(`Your alternate contact instructions have been set to \`\`${contact}\`\`!`)
    .setColor("GREEN");
  return interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };