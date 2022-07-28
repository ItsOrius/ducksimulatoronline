const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('quack')
	.setDescription('Quack!')

async function execute(client, interaction) {
  await interaction.reply({ content: 'Quack!', ephemeral: true });
}

module.exports = { data, execute };