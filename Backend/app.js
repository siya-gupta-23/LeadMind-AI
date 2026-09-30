const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middileware/errorMiddleware");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authrouts");
const leadRoutes = require("./routes/leadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Security
app.use(helmet());

// JSON body parser
app.use(express.json());
app.use(cors());

// Rate limiter for authentication APIs
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "LeadMind API is healthy",
  });
});

// Centralized error middleware - ALWAYS LAST
app.use(errorMiddleware);

module.exports = app;