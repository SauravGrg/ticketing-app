const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware.js");
const {
  createEvent,
  getAllEvents,
} = require("../controllers/eventController.js");

router.post("/", authenticateToken, createEvent);
router.get("/", getAllEvents);

module.exports = router;
