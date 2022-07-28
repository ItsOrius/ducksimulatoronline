const router = require("express").Router();

router.get("/:password", async (req, res) => {
  const secrets = require("../secrets.json");
  const { password } = req.params;
  if (secrets[password]) {
    require("./profile.js").getProfile(secrets[password]).then(profile => {
      if (profile) {
        res.status(200).json({ id: secrets[password], profile });
      } else {
        res.status(500).json({ error: "Failed to get user profile!" });
      }
    });
  } else {
    res.status(404).json({ error: "Invalid password." });
  }
});

function claimBounty(password, claimerId, res) {
  const secrets = require("../secrets.json");
  if (!secrets[password]) {
    throw new Error("Invalid password.");
  }
  const client = require("../index.js")
  const config = require("../config.json")
  client.guilds.fetch(config.guildId).then(async guild => {
    guild.members.fetch(`${claimerId}`).then(member => {
      const db = require("../db.json");
      const hunter = db.users[claimerId];
      const bounty = db.users[secrets[password]];

    }).catch(e => {
      throw new Error("User not found.");
    })
  }).catch(e => {
    if (res) {
      res.status(500).json({ error: "Failed to reach Discord server." });
    } else {
      throw new Error("Failed to reach Discord server.");
    }
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