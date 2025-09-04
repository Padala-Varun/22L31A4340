// Simple, custom request logger middleware (required by spec)
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "request.log");

module.exports = function logger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;

    const line = JSON.stringify({
      time: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Math.round(ms),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      ua: req.headers["user-agent"] || "",
    });

    // Append asynchronously; ignore write errors to not block responses
    fs.appendFile(logFile, line + "\n", () => {});
  });
  next();
};
