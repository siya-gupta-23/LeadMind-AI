const express = require("express");

const {
  analyzeLead,
  generateFollowUp,
} = require("../controllers/aiController");

const authMiddleware = require("../middileware/authMiddleware");

const router = express.Router();

router.post("/analyze/:leadId", authMiddleware, analyzeLead);

router.post("/followup/:leadId", authMiddleware, generateFollowUp);

module.exports = router;