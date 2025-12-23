const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrder,
} = require("../controllers/orderController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrder);

module.exports = router;
