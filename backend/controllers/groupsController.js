const asyncHandler = require("express-async-handler");
const mysql = require("mysql2");
const connectDB = require("../config/usersDb");

const connection = connectDB();

//Description: Get All Groups
//Route: GET /api/groups
const getAllGroups = (req, res) => {
  const getAllQuery = `
  SELECT group_id FROM Users.users_table`;

  connection.query(getAllQuery, (error, results) => {
    if (error) {
      console.log("Error selecting from Users database: ", error);
      res.status(500).json({ error: "Error selecting from database" });
      return;
    }
    let groups = [];
    results.forEach((result) => {
      if (!groups.includes(result.group_id)) {
        groups.push(result.group_id);
      }
    });
    res.status(200).json(groups);
  });
};

module.exports = {
  getAllGroups,
};
