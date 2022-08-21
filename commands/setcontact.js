const fs = require('fs');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('setcontact')
	.setDescription("If you've ever been a premium member, you give us an alternate way to contact you for your rewards when they're ready!")
  .addStringOption(option => option.setName('contact').setDescription('Tell us how to contact you, such as through a personal website or alt account.').setRequired(true))

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
async function execute(client, interaction) {
  const db = require('../db.json');
  const premiumLevel = require("../events/guildMemberUpdate.js").getBestPremiumStatus(interaction.member);
  if (premiumLevel < 2) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription('You need to have been a premium member in order to use this command!')
      .setColor("RED");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (premiumLevel == 2 && new Date() - new Date(db[interaction.user.id].firstPremium) <= 86400000) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription('<@&1008107779560583338>s must be subscribed for at least 24 hours to use this command!')
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