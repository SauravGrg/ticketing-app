const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware.js");
const { createEvent } = require("../controllers/eventController.js");

router.post("/", authenticateToken, createEvent);

module.exports = router;
