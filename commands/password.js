const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");

const data = new SlashCommandBuilder()
	.setName('password')
	.setDescription('Sends your secret password to link to Duck Simulator 2!')

function generatePassword(id) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const db = require("../secrets.json");
  let password = Object.entries(db).find(([key, value]) => value == id);
  while (!password || db[password]) {
    password = "";
    for (let i = 0; i < 8; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  if (id != db[password]) {
    db[password] = id;
    fs.writeFileSync("./secrets.json", JSON.stringify(db));
  }
  return password;
}

async function execute(client, interaction) {
  const db = require("../secrets.json");
  let password;
  Object.entries(db).forEach(([key, value]) => {
    if (value === interaction.user.id) {
      password = key;
    }
  });
  if (!password) {
    password = generatePassword(interaction.user.id);
  }
  await interaction.reply({ content: `Your personal password is ||${password}||. **DO NOT SHARE THIS WITH ANYONE ELSE!**`, ephemeral: true });
}

module.exports = { data, execute, generatePassword };