const router = require("express").Router();

router.get("/", (req, res) => {
  const LeaderboardManager = require("../LeaderboardManager.js");
  const orderedUsers = LeaderboardManager.getOrderedUsers();
  if (req.query.page === undefined) {
    req.query.page = 1;
  }
  const page = parseInt(req.query.page);
  const start = (page - 1) * 10;
  const end = start + 10;
  const users = orderedUsers.slice(start, end);
  res.status(200).json({users});
});

module.exports = { router };