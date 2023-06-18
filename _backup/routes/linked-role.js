const router = require("express").Router();
const discord = require("../discord-general.js");

router.get("/", (req, res) => {
  const { url, state } = discord.getOAuthUrl();

  // Store the signed state param in the user's cookies so we can verify
  // the value later. See:
  // https://discord.com/developers/docs/topics/oauth2#state-and-security
  res.cookie('clientState', state, { maxAge: 1000 * 60 * 5, signed: true });

  // Send the user to the Discord owned OAuth2 authorization endpoint
  res.redirect(url);
});

module.exports = { router };