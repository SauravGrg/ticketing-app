const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.post("/", authenticateToken, createOrder);

module.exports = router;
