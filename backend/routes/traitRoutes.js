const express = require("express");
const router = express.Router();

const {
  getAllTraitsFromGroup,
  getAllTraitsFromTest,
  getSelfTraits,
  createUserTraits,
  updateTraits,
  deleteTraits,
  getTraitsForOthers,
  getAdminSelf,
  getAdminTraitsFromGroup,
} = require("../controllers/traitsController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getAllTraitsFromGroup)
  .post(protect, createUserTraits);

router.route("/user").get(protect, getSelfTraits);
router.route("/others").get(protect, getTraitsForOthers);

router.route("/admin/others/:id").get(protect, getAdminTraitsFromGroup);
router.route("/admin/:id").get(protect, getAdminSelf);

router
  .route("/:id")
  .get(protect, getAllTraitsFromTest)
  .put(protect, updateTraits)
  .delete(protect, deleteTraits);

module.exports = router;
