const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    referrer: { type: String, default: null },
    location: { type: String, default: "unknown" }, // coarse-grained
    ip: { type: String, default: null },
  },
  { _id: false }
);

const UrlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortcode: { type: String, required: true, unique: true, index: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    clicks: { type: [ClickSchema], default: [] },
  },
  { versionKey: false }
);

UrlSchema.virtual("clickCount").get(function () {
  return this.clicks.length;
});

module.exports = mongoose.model("Url", UrlSchema);
