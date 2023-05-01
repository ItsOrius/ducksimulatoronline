import {
  CacheType,
  ChatInputCommandInteraction,
  Events,
  Interaction,
} from "discord.js";
import { DuckEvent, DuckCommandAutocomplete, DuckClient } from "../types";

const InteractionCreateEvent: DuckEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const chatInteract = interaction as ChatInputCommandInteraction;
      const command = (chatInteract.client as DuckClient).commands.get(
        chatInteract.commandName
      );

      if (!command) {
        console.error(`Command ${chatInteract.commandName} not found!`);
        return;
      }

      try {
        await command.execute(chatInteract);
      } catch (error) {
        console.error(error);
        await chatInteract.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } else if (interaction.isAutocomplete()) {
      const command = (interaction.client as DuckClient).commands.get(
        interaction.commandName
      ) as DuckCommandAutocomplete;

      if (!command) {
        console.error(`Command ${interaction.commandName} not found!`);
        return;
      }

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  },
};

export default InteractionCreateEvent;
