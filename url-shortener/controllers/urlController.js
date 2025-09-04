const Url = require("../models/Url");
const shortid = require("shortid");

// POST /shorturls
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, expiresAt } = req.body;

    if (!originalUrl || !expiresAt) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "originalUrl and expiresAt are required",
      });
    }

    const shortcode = shortid.generate();

    const newUrl = await Url.create({
      originalUrl,
      shortcode,
      expiresAt: new Date(expiresAt),
    });

    return res.status(201).json({
      message: "Short URL created successfully",
      shortcode: newUrl.shortcode,
      originalUrl: newUrl.originalUrl,
      expiresAt: newUrl.expiresAt,
    });
  } catch (err) {
    console.error("❌ Error in createShortUrl:", err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to create short URL",
    });
  }
};

// GET /shorturls/:shortcode
const getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortcode });

    if (!urlDoc) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Shortcode not found",
      });
    }

    return res.json({
      originalUrl: urlDoc.originalUrl,
      shortcode: urlDoc.shortcode,
      createdAt: urlDoc.createdAt,
      expiresAt: urlDoc.expiresAt,
      clickCount: urlDoc.clicks.length,
      clicks: urlDoc.clicks,
    });
  } catch (err) {
    console.error("❌ Error in getStats:", err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to fetch stats",
    });
  }
};

// GET /:shortcode
const redirect = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = await Url.findOne({ shortcode });

    if (!urlDoc) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Shortcode not found",
      });
    }

    if (new Date() > urlDoc.expiresAt) {
      return res.status(410).json({
        error: "EXPIRED",
        message: "This short URL has expired",
      });
    }

    urlDoc.clicks.push({
      ip: req.ip,
      referrer: req.get("referer") || null,
      location: "unknown",
    });
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error("❌ Error in redirect:", err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to redirect",
    });
  }
};

module.exports = {
  createShortUrl,
  getStats,
  redirect,
};
