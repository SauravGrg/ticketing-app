const { Event } = require("../models");
const { Op, json } = require("sequelize");

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

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: {
        tickets_available: { [Op.gt]: 0 },
      },
    });
    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.log("Fetching events failed:", error);
    res.status(500).json({
      success: false,
      message: "Fail to fetch events",
    });
  }
};

const getEventById = async (req, res) => {
  try {
    //const eventId = req.params.id;
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      event: {
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        location: event.location,
        ticket_price: event.ticket_price,
        tickets_total: event.tickets_total,
      },
    });
  } catch (error) {
    console.error("Get event by Id error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving the event",
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.destroy({
      where: { id: id, host_id: req.user.userId },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event,",
      error: error.message,
    });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, deleteEvent };
