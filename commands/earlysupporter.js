const fs = require('fs');
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
  .setName('earlysupporter')
  .setDescription('Use this command to get the Early Supporter role if you\'re a premium member.')

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
function execute(client, interaction) {
  const premiumLevel = require("../events/guildMemberUpdate.js").getBestPremiumStatus(interaction.member);
  console.log(interaction.member.user.tag + ": Premium Level " + premiumLevel);
  if (premiumLevel < 2 || !premiumLevel) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription('You need to have been a premium member in order to use this command!')
      .setColor("RED");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  const db = require("../db.json");
  db[interaction.member.id].firstPremium = new Date();
  fs.writeFileSync("./db.json", JSON.stringify(db));
  const config = require("../config.json");
  interaction.member.roles.add(interaction.guild.roles.cache.get(config.earlySupporterRole));
  const embed = new Discord.MessageEmbed()
    .setTitle('Success')
    .setDescription(`You have been given the <@&${config.earlySupporterRole}> role!`)
    .setColor("GREEN");
  return interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };