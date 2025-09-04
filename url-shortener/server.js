require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const logger = require("./middleware/logger");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

// --- core middlewares
app.use(express.json());
app.use(cors());

// --- mandatory custom logging (no 3rd-party logger)
app.use(logger);

// --- routes
app.use("/", urlRoutes);

// --- centralized 404
app.use((req, res) => {
  return res.status(404).json({
    error: "NOT_FOUND",
    message: "The requested resource was not found.",
  });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`URL Shortener running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
