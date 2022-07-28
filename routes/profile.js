const router = require("express").Router();

router.get("/:id", (req, res) => {
  const client = require("../index.js")
  const config = require("../config.json")
  const manager = require("../LeaderboardManager.js")
  const id = req.params.id
  const profile = manager.getUserProfile(id)
  client.guilds.fetch(config.guildId).then(guild => {
    guild.members.fetch(`${id}`).then(member => {
      profile.displayColor = member.displayHexColor
      profile.displayStyle = config.roleStyles[member.roles.highest.id]
      profile.inServer = true
      res.status(200).json(profile)
    }).catch(e => {
      profile.displayColor = "#000000"
      profile.displayStyle = "background-color: rgb(34, 34, 34); color: rgb(127, 127, 127); opacity: 50%;"
      profile.inServer = false
      res.status(200).json(profile)
    })
  })
});

module.exports = router;