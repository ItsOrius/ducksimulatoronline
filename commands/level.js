const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
  .setName('level')
  .setDescription('Replies with a user\'s level and XP.')
  .addUserOption(option => option.setName('user').setDescription('The user to check the level of.'))

async function execute(client, interaction) {
  const manager = require('../LeaderboardManager');
  let user = interaction.options.getUser('user');
  if (!user) {
    user = interaction.user;
  }
  let profile = manager.getUserProfile(user.id);
  if (!profile) {
    profile = {
      level: 0,
      xp: 0,
      nextLevelXp: manager.getNeededXp(1)
    };
  }
  const embed = new Discord.MessageEmbed()
    .setTitle(`${user.tag}'s Level`)
    .setDescription(`**Level:** ${profile.level}\n**XP:** ${profile.xp}\n**Progress:** ${profile.xp - manager.getNeededXp(profile.level)}/${profile.nextLevelXp - manager.getNeededXp(profile.level)}`)
    .setColor(interaction.member.displayHexColor)
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };