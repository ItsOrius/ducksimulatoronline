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

import type { PrismaClient } from "@prisma/client";

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
  version!: string;
  commands!: Collection<string, DuckCommand>;
  embedFooter!: EmbedFooterOptions;
  prismaClient!: PrismaClient;
}

export { DuckEvent, DuckCommand, DuckCommandAutocomplete, DuckClient };
