const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const connectDB = require("../config/usersDb");

const db = connectDB();

router.get("/me", (req, res) => {
  if (req.session.user) {
    return res.json({
      loggedIn: true,
      user: req.session.user,
    });
  } else {
    return res.json({ loggedIn: false });
  }
});

router.post("/", (req, res) => {
  // Data inputted from the login form
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  // Check if username exists in the database
  db.query(
    `SELECT id, username, password, role, title, group_id FROM users_table WHERE username = ?;`,
    username,
    (err, data) => {
      if (err) throw err;
      // If username exists, check if password matches
      if (username === data[0].username) {
        const hashedPassword = data[0].password.replace(/^\$2y(.+)$/i, "$2a$1");
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) throw err;
          // If password matches, set cookies

          if (result) {
            // req.session.user = data;
            req.session.user = data[0];
            console.log(`--- Logged in as: ${data[0].username} ---`);
            return res.json(data);
          } else {
            return res.send({ message: "Incorrect Username/Password" });
          }
        });
      } else {
        return res.json({ message: "Incorrect Username/Password" });
      }
    }
  );
});

module.exports = router;
