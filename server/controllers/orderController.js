const { Order, Event } = require("../models");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const { event_id, quantity } = req.body;
    const userId = req.user.userId;

    const event = await Event.findByPk(event_id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.tickets_available < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough tickets",
      });
    }

    const totalPrice = event.ticket_price * quantity;
    const qrCode = crypto.randomBytes(16).toString("hex");

    event.tickets_available = event.tickets_available - quantity;
    await event.save();

    const newOrder = await Order.create({
      user_id: userId,
      event_id: event.id,
      quantity: quantity,
      total_price: totalPrice,
      status: "paid",
      qr_code: qrCode,
    });

    res.status(200).json({
      success: true,
      message: "Ticket purchase successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Order error:", error);
    res.status(500).json({
      success: false,
      message: "An error occured during purchase",
    });
  }
};

module.exports = { createOrder };
