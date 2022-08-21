const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('leaderboard')
	.setDescription('Replies with a link to the server leaderboard.');

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
function execute(client, interaction) {
	interaction.reply({ content: 'https://ducksimulator.com/leaderboard', ephemeral: true });
}

module.exports = { data, execute };