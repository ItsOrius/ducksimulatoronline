const store = new Map();

async function storeDiscordTokens(userId, tokens) {
  await store.set(`discord-${userId}`, tokens);
}

async function getDiscordTokens(userId) {
  return store.get(`discord-${userId}`);
}

module.exports = { storeDiscordTokens, getDiscordTokens };