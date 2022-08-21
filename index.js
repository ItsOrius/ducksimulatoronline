require('dotenv').config()

const { Client, Collection, Intents } = require('discord.js');
const express = require("express")
const bodyParser = require("body-parser");
const fs = require("fs")
const path = require("path")

const config = require("./config.json")





/* setup website */
const app = express();
app.use(express.static(__dirname + "/website"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pages = {
  "/": "/website/index.html",
  "/leaderboard": "/website/leaderboard.html"
}

const redirects = {
  "/discord": "https://discord.com/servers/duck-simulator-908148295606628363",
  "/steam": "https://store.steampowered.com/app/1808800/Duck_Simulator_2/",
  "/xbox": "https://xbox.com/en-us/games/store/duck-simulator-2/9pkkrpblfqpk",
}

Object.entries(pages).forEach(page => {
  app.get(page[0], (req, res) => {
    res.sendFile(__dirname + page[1])
  })
});

Object.entries(redirects).forEach(redirect => {
  app.get(redirect[0], (req, res) => {
    res.redirect(redirect[1])
  })
})

const routesPath = path.join(__dirname, "routes")
const routeFiles = fs.readdirSync(routesPath).filter(file => file.endsWith('.js'));

for (const file of routeFiles) {
  // make app use router file
  app.use(`/api/v1/${file.replace('.js', '')}`, require(`${routesPath}/${file}`).router);
}

app.listen(process.env.PORT, () => {
  console.log('Website started!');
});





/* setup discord */
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  event.names.forEach(name => {
    client.on(name, (...args) => event.execute(client, ...args));
  });
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const today = new Date();
  const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  console.log(`Time of startup: ${dateTime}`)
  client.user.setActivity('your every move...', { type: 'WATCHING' });
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(client, interaction);
  } catch (error) {
    //console.error(error);
    await interaction.reply({ content: `**There was an error while executing this command!**\`\`\`${error}\`\`\``, ephemeral: true });
  }
});

client.on('debug', console.log);

client.login(process.env.TOKEN);

module.exports = client