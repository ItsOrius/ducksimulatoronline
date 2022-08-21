const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('quack')
	.setDescription('Quack!')

/**
 * @param {Discord.Client} client 
 * @param {Discord.Interaction} interaction 
 */
function execute(client, interaction) {
  interaction.reply({ content: 'Quack!', ephemeral: true });
}

module.exports = { data, execute };