const sequelize = require("../config/database");

const User = require("./User");
const Event = require("./Event");
const Order = require("./Order");
const ScannedTicket = require("./ScannedTicket");

// Relationship between User and Event
User.hasMany(Event, {
  foreignKey: "host_id",
  as: "events",
});

Event.belongsTo(User, {
  foreignKey: "host_id",
  as: "host",
});

// Relationship between User and Order
User.hasMany(Order, {
  foreignKey: "user_id",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Relationship between Event and Order
Event.hasMany(Order, {
  foreignKey: "event_id",
  as: "orders",
});

Order.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

// Relationship between Order and ScannedTicket
Order.hasOne(ScannedTicket, {
  foreignKey: "order_id",
  as: "scanned_ticket",
});

ScannedTicket.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

// Relationship between User and ScannedTicket
User.hasMany(ScannedTicket, {
  foreignKey: "scanned_by",
  as: "scanned_tickets",
});

ScannedTicket.belongsTo(User, {
  foreignKey: "scanned_by",
  as: "scanner",
});

module.exports = {
  sequelize,
  User,
  Event,
  Order,
  ScannedTicket,
};
