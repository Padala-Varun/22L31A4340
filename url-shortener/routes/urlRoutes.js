const express = require("express");
const router = express.Router();
console.log("✅ urlRoutes.js loaded");

const {
  createShortUrl,
  redirect,
  getStats,
} = require("../controllers/urlController");

// API endpoints spec
router.post(
  "/shorturls",
  (req, res, next) => {
    console.log("📩 Incoming POST /shorturls", req.body);
    next(); // continue to controller
  },
  createShortUrl
);

// Retrieve Short URL Statistics - should come before the generic redirect route
router.get("/shorturls/:shortcode", getStats);

// Redirection route - this should be last to avoid shadowing other routes
// Also consider adding a more specific path to avoid conflicts
router.get("/:shortcode", redirect);

module.exports = router;
