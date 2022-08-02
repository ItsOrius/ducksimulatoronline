const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const Discord = require("discord.js");
const fs = require("fs");

const limiter = rateLimit({
  max: 3,
  windowMs: 60000,
  message: "Too many requests, please try again in a minute."
});

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

router.post("/:password/claim", limiter, (req, res) => {
  try {
    claimBounty(req.params.password, req.body.claimerId, res);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

function getTimeString(milliseconds) {
  const millis = milliseconds % 1000;
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / 60000);
  let timeString;
  if (minutes < 10) {
    timeString = `0${minutes}:`;
  } else {
    timeString = `${minutes}:`;
  }
  if (seconds < 10) {
    timeString += `0${seconds}.`;
  } else {
    timeString += `${seconds}.`;
  }
  if (millis > 100) {
    timeString += `${millis}`;
  } else if (millis > 10) {
    timeString += `0${millis}`;
  } else {
    timeString += `00${millis}`;
  }
  return timeString;
}

router.post("/:password/reward", limiter, (req, res) => {
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
        res.status(200).json({ message: "Successfully rewarded!" });
        return true;
      } else if (rewardType == "speedrun") {
        if (!rewardValue) {
          res.status(404).json({ error: "Invalid reward value." })
          return;
        }
        const timeString = getTimeString(rewardValue);
        if (rewardValue / 60000 < 10 && !member.roles.cache.has(config.speedrunRole)) {
          member.roles.add(config.speedrunRole);
        }
        if (!db[id].config.fastestSpeedrun || rewardValue < (db[id].config.fastestSpeedrun || 0)) {
          db[id].config.fastestSpeedrun = rewardValue;
          fs.writeFileSync("./db.json", JSON.stringify(db));
          guild.channels.fetch(config.speedrunFeedChannel.toString()).then(channel => {
            const embed = new Discord.MessageEmbed()
              .setDescription(`${member.toString()} achieved a speedrun of **${timeString}**!`)
              .setColor(member.roles.color.color || config.botColor)
              .setTimestamp();
            channel.send({ embeds: [embed] });
            console.log(`${db[id].username}#${db[id].discriminator} (${id}) has achieved a speedrun of ${timeString}!`);
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
          res.status(200).json({ message: "Successfully rewarded!" });
          return true;
        }
      } else {
        res.status(404).json({ error: "Invalid reward type." });
        return;
      }
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