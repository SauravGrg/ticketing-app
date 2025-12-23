const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrder,
  getHostOrders,
} = require("../controllers/orderController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrder);
router.get("/hosted-events", authenticateToken, getHostOrders);

module.exports = router;
