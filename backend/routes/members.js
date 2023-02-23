const express = require("express");
const router = express.Router();

const {
  getAllMembers,
  getMembers,
  getAll,
} = require("../controllers/membersController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAllMembers);
router.route("/all").get(protect, getAll);
router.route("/:id").get(protect, getMembers);

module.exports = router;
