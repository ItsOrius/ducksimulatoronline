const router = require("express").Router();

async function getProfile(id, res) {
  const client = require("../index.js")
  const config = require("../config.json")
  const manager = require("../LeaderboardManager.js")
  const profile = manager.getUserProfile(id)
  return await client.guilds.fetch(config.guildId).then(async guild => {
    return await guild.members.fetch(`${id}`).then(member => {
      profile.displayColor = member.displayHexColor
      profile.displayStyle = config.roleStyles[member.roles.highest.id]
      profile.inServer = true
      if (res) {
        res.status(200).json(profile)
      }
      return profile;
    }).catch(e => {
      if (!profile) return;
      profile.displayColor = "#000000"
      profile.displayStyle = "background-color: rgb(34, 34, 34); color: rgb(127, 127, 127); opacity: 50%;"
      profile.inServer = false
      if (res) {
        res.status(200).json(profile)
      }
      return profile;
    })
  }).then(result => {
    if (!result) {
      console.log(result)
      if (res) {
        res.status(404).json({error: "User not found."})
      }
    }
    return result;
  })
}

router.get("/:id", (req, res) => {
  getProfile(req.params.id, res);
});

module.exports = { router, getProfile };