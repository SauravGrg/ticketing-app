const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models");

// Route Imports
const eventRoutes = require("./routes/eventRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const orderRoute = require("./routes/orderRoute.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(express.json());
app.use(cors());

// Route Mounting
console.log("Server.js: Routes are being initialized...");
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/orders", orderRoute);

// Health Check & Test Routes
app.get("/", (req, res) => {
  res.json({ message: "Ticketing API is running." });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await sequelize.query("SELECT NOW()");
    res.json({
      success: true,
      currentTime: result[0][0].now,
      message: "Database query successfull!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Server Startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({
      alter: true,
    });
    console.log("Database tables synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Unable to connect to the database: ", error);
    process.exit(1);
  }
};

startServer();
