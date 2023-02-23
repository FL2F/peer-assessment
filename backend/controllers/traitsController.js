const connectDB = require("../config/db");

const connection = connectDB();

// TRAITS

//Description: Get Traits for user as inputed by other students
//Route: GET /api/traits/
const getAllTraitsFromGroup = (req, res) => {
  const getGroupTraitsQuery = `
  SELECT * FROM traits.traits 
  WHERE subject_id = ? AND inputer_id != ?`;

  const value = [req.user.id, req.user.id];

  connection.query(getGroupTraitsQuery, value, (error, results) => {
    if (error) {
      console.log("Error seleting from database: ", error);
      res.status(500).json({ error: "Error seleting from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get traits from  user as inputed by user
//Route: GET /api/traits/user
const getSelfTraits = (req, res) => {
  const getOneQuery = `
  SELECT * FROM traits.traits 
  WHERE subject_id = ? AND inputer_id = ?`;

  const values = [req.user.id, req.user.id];

  connection.query(getOneQuery, values, (error, results) => {
    if (error) {
      console.log("Error seleting from database: ", error);
      res.status(500).json({ error: "Error seleting from database" });
      return;
    }
    res.status(200).json(results);
  });
};

// ADMIN ONLY!
//---
//Description: Get the self test taken by and for the admin
//Route: GET /api/traits/admin/:id
const getAdminSelf = (req, res) => {
  const getAllQuery = `
  SELECT * FROM traits.traits WHERE inputer_id = ? AND subject_id = ? AND group_id = ?`;
  const value = [req.user.id, req.user.id, req.params.id];

  connection.query(getAllQuery, value, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

// ADMIN ONLY!
//---
//Description: Get Traits for admin user as inputed by other students
//Route: GET /api/traits/admin
const getAdminTraitsFromGroup = (req, res) => {
  const getGroupTraitsQuery = `
  SELECT * FROM traits.traits 
  WHERE subject_id = ? AND inputer_id != ? AND group_id = ?`;

  const value = [req.user.id, req.user.id, req.params.id];

  connection.query(getGroupTraitsQuery, value, (error, results) => {
    if (error) {
      console.log("Error seleting from database: ", error);
      res.status(500).json({ error: "Error seleting from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get traits for other members, as inputed by the user
//Route: GET /api/traits/others
const getTraitsForOthers = (req, res) => {
  const getOneQuery = `
  SELECT * FROM traits.traits 
  WHERE inputer_id = ? AND subject_id != inputer_id`;

  const values = [req.user.id];

  connection.query(getOneQuery, values, (error, results) => {
    if (error) {
      console.log("Error seleting from database: ", error);
      res.status(500).json({ error: "Error seleting from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Get All Traits from a test (this is assigned each time you select traits and submit)
//Route: GET /api/traits/:id
const getAllTraitsFromTest = (req, res) => {
  const getAllQuery = `
  SELECT * FROM traits.traits WHERE test_id = ?`;
  const values = [req.params.id];

  connection.query(getAllQuery, values, (error, results) => {
    if (error) {
      console.log("Error selection from database: ", error);
      res.status(500).json({ error: "Error selection from database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Create trait
//Route: POST /api/traits
const createUserTraits = (req, res) => {
  // Build the INSERT query
  const insertQuery = `INSERT INTO traits.traits (trait_id, subject_id, inputer_id, adjectives, group_id, test_id) VALUES (?, ?, ?, ?, ?, ?)`;
  const traitValues = [
    req.body.trait_id,
    req.body.subject_id,
    req.user.id,
    req.body.adjective,
    req.body.group_id,
    req.body.test_id,
  ];

  connection.query(insertQuery, traitValues, (error, results) => {
    if (error) {
      console.log("Error inserting into database: ", error);
      res.status(500).json({ error: "Error inserting into database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Description: Update Specific trait
//Route: PUT /api/traits/:id
const updateTraits = (req, res) => {
  const updateQuery = `
  REPLACE INTO traits.traits (
   trait_id,
   subject_id, 
   inputer_id, 
   adjectives, 
   test_id,
   group_id
  )
  VALUES(?, ?, ?, ?, ?, ?)
  `;
  const traitValues = [
    req.body.trait_id,
    req.body.subject_id,
    req.user.id,
    req.body.adjectives,
    req.body.test_id,
    req.body.group_id,
  ];

  connection.query(updateQuery, traitValues, (error, results) => {
    if (error) {
      console.log("Error inserting into database: ", error);
      res.status(500).json({ error: "Error inserting into database" });
      return;
    }
    res.status(200).json(results);
  });
};

//Delete all traits with a specific test_id
//Route: DEL /api/traits/:id
const deleteTraits = (req, res) => {
  const deleteQuery = `
  DELETE FROM traits.traits
  WHERE test_id = ?
  `;
  const value = [req.params.id];

  connection.query(deleteQuery, value, (error, results) => {
    if (error) {
      console.log("Error inserting into database: ", error);
      res.status(500).json({ error: "Error inserting into database" });
      return;
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getAllTraitsFromGroup,
  getSelfTraits,
  getAdminSelf,
  getAdminTraitsFromGroup,
  getTraitsForOthers,
  getAllTraitsFromTest,
  createUserTraits,
  updateTraits,
  deleteTraits,
};
