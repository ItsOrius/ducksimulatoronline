// Custom Definitions
// Despite the name, this is not a definition file. It is a file that contains classes, interfaces, and types that are used throughout the bot.

import {
  SlashCommandBuilder,
  ClientEvents,
  Awaitable,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  Client,
  EmbedFooterOptions,
  Collection,
} from "discord.js";
import { db } from "shared";

interface DuckEvent<T extends keyof ClientEvents> {
  name: T;
  once: boolean;
  execute(...args: ClientEvents[T]): Awaitable<void>;
}

interface DuckCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Awaitable<void>;
}

interface DuckCommandAutocomplete extends DuckCommand {
  autocomplete: (interaction: AutocompleteInteraction) => Awaitable<void>;
}

class DuckClient extends Client {
  version: string;
  commands: Collection<string, DuckCommand>;
  embedFooter: EmbedFooterOptions;
  databaseConnection: db;
}

export { DuckEvent, DuckCommand, DuckCommandAutocomplete, DuckClient };
