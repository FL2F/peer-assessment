const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  req.session.destroy();
  console.log("--- Logged out ---");
  res.send({ message: "Successfully logged out" });
});

module.exports = router;
