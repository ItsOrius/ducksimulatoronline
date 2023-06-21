import { SlashCommandBuilder } from "discord.js";
import { DuckCommand } from "../types";

const QuackCommand: DuckCommand = {
  data: new SlashCommandBuilder().setName("quack").setDescription("Quack!"),
  async execute(interaction) {
    await interaction.reply({ content: "Quack!", ephemeral: true });
  },
};

export default QuackCommand;
