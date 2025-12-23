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

const getUserOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userOrders = await Order.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["title", "event_date", "location"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Orders retrived successfully",
      event: userOrders,
    });
  } catch (error) {
    console.log("Error while serching users orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error searching user orders",
    });
  }
};

const getHostOrders = async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({
        success: false,
        message: "Only host can access these data",
      });
    }
    const currentUserId = req.user.userId;
    const userOrders = await Order.findAll({
      include: {
        model: Event,
        as: "event",
        where: {
          host_id: currentUserId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Here are all the order details",
      orders: userOrders,
    });
  } catch (error) {
    console.log("Error occur while loading the data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while loading the orders",
    });
  }
};

const verifyTicket = async (req, res) => {
  try {
    const { qr_code } = req.body;

    if (req.user.role !== "host") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only hosts can verify tickets",
      });
    }
    const hostId = req.user.userId;
    const userTicket = await Order.findOne({
      where: {
        qr_code: qr_code,
      },
      include: {
        model: Event,
        as: "event",
        where: {
          host_id: hostId,
        },
      },
    });

    if (!userTicket) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket",
      });
    }

    if (userTicket.status === "scanned") {
      return res.status(400).json({
        success: false,
        message: "Ticket already scanned",
      });
    }

    userTicket.status = "scanned";
    await userTicket.save();

    res.status(200).json({
      success: true,
      message: "Ticket scanned successfully",
    });
  } catch (error) {
    console.log("Ticket Verification Error:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred during verification",
    });
  }
};

module.exports = { createOrder, getUserOrder, getHostOrders, verifyTicket };
