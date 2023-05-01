import { ActivityType, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { DuckClient, DuckCommand, DuckEvent } from "./types";

import { config } from "dotenv";
config();

let client: DuckClient = null;

async function createClient() {
  client = new DuckClient({
    intents: [GatewayIntentBits.Guilds],
    presence: {
      activities: [{ name: "your every move...", type: ActivityType.Watching }],
    },
  });
  client.commands = new Collection();
  const pkg = await import(resolve(join(__dirname, "..", "package.json")));
  client.version = pkg.version as string;
  client.embedFooter = {
    text: `Quacker • v${client.version}`,
  };
}

async function loadCommands() {
  const commandsPath = resolve(join(__dirname, "commands"));
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of commandFiles) {
    const filePath = resolve(join(commandsPath, file));
    const imported = await import(filePath);
    const command = imported.default as DuckCommand;
    client.commands.set(command.data.name, command);
  }
}

async function loadEvents() {
  const eventsPath = resolve(join(__dirname, "events"));
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of eventFiles) {
    const filePath = resolve(join(eventsPath, file));
    const imported = await import(filePath);
    const event = imported.default as DuckEvent<any>;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}

async function start() {
  await createClient();
  await loadCommands();
  await loadEvents();

  client.login(process.env.TOKEN);
}

start();
