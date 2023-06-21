import { SlashCommandBuilder } from "discord.js";
import { DuckCommand } from "../types";

const PingCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Bot being slow? Get the ping of the bot!"),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    interaction.editReply(
      `Pong! Latency is ${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms`
    );
  },
};

export default PingCommand;
