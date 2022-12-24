const router = require("express").Router();

const discord = require('../discord-general.js');
const storage = require('../discord-storage.js');
const config = require("../config.json");

const { getProfile } = require("./profile.js");

async function updateMetadata(userId) {
  // Fetch the Discord tokens from storage
  const tokens = await storage.getDiscordTokens(userId);
    
  let metadata = {};
  try {
    // Fetch the new metadata you want to use from an external source. 
    // This data could be POST-ed to this endpoint, but every service
    // is going to be different.  To keep the example simple, we'll
    // just generate some random data.
    const profile = await getProfile(userId);
    if (!profile.config) {
      profile.config = {};
    }
    metadata = {
      islinkedds2: (profile.config.linked ?? false) ? 1 : 0,
      hasbeatends2: (profile.config.fastestSpeedrun != undefined) ? 1 : 0,
      hascompletedds2: (profile.roles.includes(config.rewardRoles.ds2_true)) ? 1 : 0,
      secondstocompleteds2: 3600
    };
    if (profile.config.fastestSpeedrun) {
      metadata.secondstocompleteds2 = Math.ceil(profile.config.fastestSpeedrun / 1000);
    }
    console.log(metadata);
  } catch (e) {
    e.message = `Error fetching external data: ${e.message}`;
    console.error(e);
    // If fetching the profile data for the external service fails for any reason,
    // ensure metadata on the Discord side is nulled out. This prevents cases
    // where the user revokes an external app permissions, and is left with
    // stale linked role data.
  }
  // Push the data to Discord.
  await discord.pushMetadata(userId, tokens, metadata);
}

router.get("/", async (req, res) => {
  try {
    // 1. Uses the code and state to acquire Discord OAuth2 tokens
    const code = req.query['code'];
    const discordState = req.query['state'];
    // make sure the state parameter exists
    const { clientState } = req.signedCookies;
    if (clientState !== discordState) {
      console.error('State verification failed.');
      return res.sendStatus(403);
    }
    const tokens = await discord.getOAuthTokens(code);
    // 2. Uses the Discord Access Token to fetch the user profile
    const meData = await discord.getUserData(tokens);
    const userId = meData.user.id;
    await storage.storeDiscordTokens(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });
    // 3. Update the users metadata, assuming future updates will be posted to the `/update-metadata` endpoint
    await updateMetadata(userId);
    res.send('Successfully linked Duck Simulator account!');
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = { router };