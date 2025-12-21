const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware.js");
const {
  createEvent,
  getAllEvents,
  getEventById,
} = require("../controllers/eventController.js");

router.post("/", authenticateToken, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);

module.exports = router;
