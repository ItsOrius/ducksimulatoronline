const router = require("express").Router();
const Discord = require("discord.js");
const e = require("express");
const fs = require("fs");

router.get("/:password", async (req, res) => {
  const secrets = require("../secrets.json");
  const { password } = req.params;
  if (secrets[password]) {
    require("./profile.js").getProfile(secrets[password]).then(profile => {
      if (!profile) {
        res.status(500).json({ error: "Failed to get user profile!" });
        return;
      }
      res.status(200).json({ id: secrets[password], profile });
    });
  } else {
    res.status(404).json({ error: "Invalid password." });
  }
});

function claimBounty(password, claimerId, res) {
  const secrets = require("../secrets.json");
  const db = require("../db.json");
  if (!secrets[password]) {
    throw new Error("Invalid password.");
  }
  if (db[secrets[password]].config.claimer) {
    throw new Error("This password has already been claimed.");
  }
  if (secrets[password] === claimerId) {
    throw new Error("You cannot claim your own bounty.");
  }
  const client = require("../index.js")
  const config = require("../config.json")
  return client.guilds.fetch(config.guildId).then(async guild => {
    return guild.members.fetch(`${claimerId}`).then(member => {
      db[secrets[password]].config.claimer = claimerId;
      db[claimerId].config.claims++;
      fs.writeFileSync("../db.json", JSON.stringify(db));
      if (res) {
        res.status(200).json({ message: "Successfully claimed!" });
      }
      return true;
    }).catch(e => {
      throw new Error("Claimer not found.");
    })
  }).catch(e => {
    if (res) {
      res.status(500).json({ error: "Failed to reach Discord server." });
      return;
    }
    throw new Error("Failed to reach Discord server.");
  });
}

router.post("/:password/claim", (req, res) => {
  try {
    claimBounty(req.params.password, req.body.claimerId, res);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

router.post("/:password/reward", (req, res) => {
  const secrets = require("../secrets.json");
  const config = require("../config.json");
  const client = require("../index.js");
  const db = require("../db.json");
  const id = secrets[req.params.password];
  if (!id) {
    res.status(404).json({ error: "Invalid password." });
    return;
  }
  if (db[id].config.claimer) {
    res.status(404).json({ error: "This password has been locked." });
    return;
  }
  return client.guilds.fetch(config.guildId).then(async guild => {
    return guild.members.fetch(`${id}`).then(member => {
      const { rewardType, rewardValue } = req.body;
      if (rewardType == "role") {
        if (!Object.keys(config.rewardRoles).includes(rewardValue)) {
          res.status(404).json({ error: "Invalid reward role." });
          return;
        }
        if (!member.roles.cache.has(config.rewardRoles[rewardValue])) {
          member.roles.add(config.rewardRoles[rewardValue]);
          console.log(`${db[id].username}#${db[id].discriminator} (${id}) has earned the reward role ${rewardValue} (${config.rewardRoles[rewardValue]})!`);
        }
      } else if (rewardType == "speedrun") {
        if (!rewardValue) {
          res.status(404).json({ error: "Invalid reward value." })
          return;
        }
        const millis = rewardValue % 1000;
        const seconds = Math.floor(rewardValue / 1000) % 60;
        const minutes = Math.floor(rewardValue / 60000);
        let isNewRecord = false;
        if (!db[id].config.fastestSpeedrun || rewardValue < (db[id].config.fastestSpeedrun || 0)) {
          db[id].config.fastestSpeedrun = rewardValue;
          isNewRecord = true;
          fs.writeFileSync("./db.json", JSON.stringify(db));
        }
        if (minutes < 10) {
          member.roles.add(config.speedrunRole);
        }
        if (isNewRecord) {
          guild.channels.fetch(config.speedrunFeedChannel).then(channel => {
            const embed = new Discord.MessageEmbed()
              .setDescription(`${member.toString()} achieved a speedrun of **${minutes}:${seconds}.${millis}**!`)
              .setColor(member.roles.color || config.botColor)
            channel.send({ embeds: [embed] });
            console.log(`${db[id].username}#${db[id].discriminator} (${id}) has achieved a speedrun of **${minutes}:${seconds}.${millis}**!`);
            res.status(200).json({ message: "Successfully submitted!" });
          });
        } else {
          res.status(200).json({ message: "Successfully submitted, but not a new personal best." });
        }
      } else if (rewardType == "signup") {
        if (!db[id].config.linked) {
          console.log(`${db[id].username}#${db[id].discriminator} (${id}) has linked their account to their game!`);
          db[id].config.linked = true;
          db[id].xp += 1000;
          fs.writeFileSync("./db.json", JSON.stringify(db));
        }
      } else {
        res.status(404).json({ error: "Invalid reward type." });
        return;
      }
      res.status(200).json({ message: "Successfully rewarded!" });
      return true;
    }).catch(e => {
      res.status(404).json({ error: "User not in Discord server." });
      return;
    })
  }).catch(e => {
    res.status(500).json({ error: "Failed to reach Discord server." });
    return;
  });
})

module.exports = { router, claimBounty }