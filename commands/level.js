const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
  .setName('level')
  .setDescription('Replies with a user\'s level and XP.')
  .addUserOption(option => option.setName('user').setDescription('The user to check the level of.'))

async function execute(client, interaction) {
  const manager = require('../LeaderboardManager');
  const { levelRoles } = require('../config.json');
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
  const nextReward = { level: -1, id: -1 };
  for (let i = 0; i < Object.keys(levelRoles); i++) {
    if (profile.level < Object.keys(levelRoles)[i]) {
      nextReward.level = Object.keys(levelRoles)[i]
      nextReward.id = Object.values(levelRoles)[i];
      break;
    }
  }
  const embed = new Discord.MessageEmbed()
    .setTitle(`${user.tag}'s Level`)
    .addFields([
      { name: "Level", value: `${profile.level}`, inline: true },
      { name: "Total XP", value: `${profile.xp}`, inline: true },
      { name: "Progress", value: `${profile.xp - manager.getNeededXp(profile.level)}/${profile.nextLevelXp - manager.getNeededXp(profile.level)}` },
      { name: "Next Reward", value: `Level ${nextReward.level} (<@&${nextReward.id}>)`, inline: true }
    ])
    .setColor(interaction.member.displayHexColor)
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };