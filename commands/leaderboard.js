const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('leaderboard')
	.setDescription('Replies with a link to the server leaderboard.');

async function execute(client, interaction) {
	await interaction.reply({ content: 'https://ducksimulator.com/leaderboard', ephemeral: true });
}

module.exports = { data, execute };