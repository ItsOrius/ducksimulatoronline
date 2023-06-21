import { ActivityType, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { DuckClient, DuckCommand, DuckEvent } from "./types";
import { config as dotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv();

let client: DuckClient | undefined = undefined;

const createClient = async () => {
  client = new DuckClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
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
  client.prismaClient = new PrismaClient();
};

const loadCommands = async () => {
  const commandPath = resolve(join(__dirname, "commands"));
  const commandFiles = readdirSync(commandPath).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of commandFiles) {
    const filePath = resolve(join(commandPath, file));
    const imported = await import(filePath);
    const command = imported.default as DuckCommand;
    client?.commands.set(command.data.name, command);
    console.log(`Loaded command ${command.data.name}`);
  }
};

const loadEvents = async () => {
  const eventsPath = resolve(join(__dirname, "events"));
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".js")
  );
  for (const file of eventFiles) {
    const filePath = resolve(join(eventsPath, file));
    const imported = await import(filePath);
    const event = imported.default as DuckEvent<any>;
    if (event.once) {
      client?.once(event.name, (...args) => event.execute(...args));
      console.log(`Loaded once event ${event.name}`);
    } else {
      client?.on(event.name, (...args) => event.execute(...args));
      console.log(`Loaded event ${event.name}`);
    }
  }
};

async function cleanup() {
  if (client == undefined) process.exit(); // No client means no connection to close

  try {
    await client?.prismaClient.$disconnect();
    console.log("Database connection closed successfully");
  } catch (error) {
    console.error("Error closing database connection:", error);
    await client?.prismaClient.$disconnect();
  } finally {
    process.exit();
  }
}

process.on("exit", cleanup);
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

(async () => {
  await createClient();
  await loadCommands();
  await loadEvents();

  client!.login(process.env.BOT_TOKEN);
})();
