import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DuckClient, DuckCommand } from "../types";
import config from "../config.json";
import { deleteUser } from "../database/deleteUser";

const DebugCommand: DuckCommand = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription("DEBUG")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subCmdDelete) =>
      subCmdDelete
        .setName("delete")
        .setDescription("Delete a user from the DB")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("User to be deleted")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (interaction.options.getSubcommand() == "delete") {
      if (interaction.user.id != config.ownerID) {
        await interaction.editReply({
          content: "You do not have permission to use that command",
        });
        return;
      }

      const client = interaction.client as DuckClient;
      const prisma = client.prismaClient;
      const user = interaction.options.getUser("target");

      await deleteUser(user?.id!, prisma);

      await interaction.editReply({
        content: "Done!",
      });
    }
  },
};

export default DebugCommand;
