const connectDB = require("../config/db");

const connection = connectDB();

//Description: Create trait
//Route: POST /api/tests
const createTest = (req, res) => {
  // Build the INSERT query
  const insertQuery = `REPLACE INTO traits.tests (test_id, subject_id, inputer_id, username, group_id, title) VALUES (?,?,?,?,?,?)`;
  const values = [
    req.body.test_id,
    req.body.subject_id,
    req.body.inputer_id,
    req.body.username,
    req.body.group_id,
    req.body.title,
  ];

  connection.query(insertQuery, values, (error, results) => {
    if (error) {
      console.log("Error inserting into database: ", error);
      res.status(500).json({ error: "Error inserting into database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get All Tests that the user created
//Route: GET /api/tests
const getAllTests = (req, res) => {
  const getAllQuery = `
  SELECT * FROM traits.tests WHERE inputer_id = ?`;
  const value = req.user.id;

  connection.query(getAllQuery, value, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

// //Description: Get the self test taken by and for the admin
// //Route: GET /api/tests/admin
// const getAdminSelf = (req, res) => {
//   const getAllQuery = `
//   SELECT * FROM traits.tests WHERE inputer_id = ? AND subject_id = ?`;
//   const value = [req.user.id, req.user.id];

//   connection.query(getAllQuery, value, (error, results) => {
//     if (error) {
//       console.log("Error selection from database: ", error);
//       res.status(500).json({ error: "Error selection from database" });
//       return;
//     }
//     res.status(200).json(results);
//   });
// };

//Description: Get All Tests that the admin user created fpor specific group
//Route: GET /api/tests/:id
const getAllAdminTests = (req, res) => {
  const getAllQuery = `
  SELECT * FROM traits.tests WHERE inputer_id = ? AND group_id = ?`;
  const value = [req.user.id, req.params.id];

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
  createTest,
  getAllTests,
  getAllAdminTests,
};
