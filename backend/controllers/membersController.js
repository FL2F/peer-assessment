const connectDB = require("../config/usersDb");

const connection = connectDB();

//Description: Get All Memebers for user's group
//Route: GET /api/members/all
const getAll = (req, res) => {
  const getAllQuery = `
  SELECT id, username, title, role, group_id, facilitator FROM Users.users_table `;

  connection.query(getAllQuery, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get All Memebers for user's group
//Route: GET /api/members/
const getAllMembers = (req, res) => {
  const getAllQuery = `
  SELECT id, username, title, role, group_id, facilitator FROM Users.users_table WHERE group_id = ?`;
  const value = req.user.group_id;

  connection.query(getAllQuery, value, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};
//Description: Get All Memebers for specific group -- admin only
//Route: GET /api/members/:id
const getMembers = (req, res) => {
  const getAllQuery = `
  SELECT id, username, title, role, group_id, facilitator FROM Users.users_table WHERE group_id = ?`;
  const value = req.params.id;

  connection.query(getAllQuery, value, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getAllMembers,
  getMembers,
  getAll,
};
