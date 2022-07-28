const router = require("express").Router();

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
  if (db[secrets[password]].claimer) {
    throw new Error("This password has already been claimed.");
  }
  if (secrets[password] === claimerId) {
    throw new Error("You cannot claim your own bounty.");
  }
  const client = require("../index.js")
  const config = require("../config.json")
  return client.guilds.fetch(config.guildId).then(async guild => {
    return guild.members.fetch(`${claimerId}`).then(member => {
      db.users[secrets[password]].config.claimer = claimerId;
      db.users[claimerId].config.claims++;
      fs.writeFileSync("./db.json", JSON.stringify(db));
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
  } catch(e) {
    res.status(404).json({ error: e.message });
  }
});

module.exports = { router, claimBounty }