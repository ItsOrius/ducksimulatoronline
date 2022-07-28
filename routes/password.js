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

module.exports = { router };