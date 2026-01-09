const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware.js");
const {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
} = require("../controllers/eventController.js");

router.post("/", authenticateToken, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.delete("/:id", authenticateToken, deleteEvent);

module.exports = router;
