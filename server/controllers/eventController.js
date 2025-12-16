const { Event } = require("../models");

const createEvent = async (req, res) => {
  if (req.user.role !== "host") {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to create events",
    });
  }

  try {
    const {
      title,
      description,
      event_date,
      location,
      ticket_price,
      tickets_total,
    } = req.body;

    const host_id = req.user.userId;

    const newEvent = await Event.create({
      host_id: host_id,
      title: title,
      description: description,
      event_date: event_date,
      location: location,
      ticket_price: ticket_price,
      tickets_total: tickets_total,
      tickets_available: tickets_total,
    });
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: {
        title: newEvent.title,
        description: newEvent.description,
        event_date: newEvent.event_date,
        location: newEvent.location,
        ticket_price: newEvent.ticket_price,
        tickets_total: newEvent.tickets_total,
      },
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during event creation",
    });
  }
};

module.exports = { createEvent };
