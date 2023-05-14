import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";

import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { DuckCommand } from "./types";
import config from "./config.json";

import { config as dotenv } from "dotenv";
dotenv();

const commands = [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function loadCommands() {
  const commandsPath = resolve(join(__dirname, "commands"));
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of commandFiles) {
    const filePath = resolve(join(commandsPath, file));
    const imported = await import(filePath);
    const command = imported.default as DuckCommand;
    commands.push(command.data.toJSON());
  }
}

async function start() {
  await loadCommands();

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = (await rest.put(
      Routes.applicationCommands(config.clientID.toString()),
      { body: commands }
    )) as any;

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
}

start();
