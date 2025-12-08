const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

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
