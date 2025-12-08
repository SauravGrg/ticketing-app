const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ScannedTicket = sequelize.define(
  "ScannedTicket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "orders",
        key: "id",
      },
    },
    scanned_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    scanned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "scannedtickets",
    timestamps: true,
    underscored: true,
  }
);

module.exports = ScannedTicket;
