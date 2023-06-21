import { SlashCommandBuilder } from "discord.js";
import { DuckCommand } from "../types";
import config from "../config.json";

const LeaderboardCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Replies with a link to the server leaderboard."),
  async execute(interaction) {
    await interaction.reply({
      content: config.leaderboardURL,
      ephemeral: true,
    });
  },
};

export default LeaderboardCommand;
