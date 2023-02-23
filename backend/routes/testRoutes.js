const express = require("express");
const router = express.Router();

const {
  createTest,
  getAllTests,
  getAllAdminTests,
} = require("../controllers/testController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createTest).get(protect, getAllTests);
router.route("/:id").get(protect, getAllAdminTests);

module.exports = router;
