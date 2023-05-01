const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Sets if you will be pinged when you level up.')
  .addBooleanOption(option => option.setName('value').setDescription('Whether or not you want to be pinged when you level up.').setRequired(true));

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
async function execute(client, interaction) {
  const LeaderboardManager = require('../LeaderboardManager');
  LeaderboardManager.setShouldPingUser(interaction, interaction.options.getBoolean('value'));
}

module.exports = { data, execute };