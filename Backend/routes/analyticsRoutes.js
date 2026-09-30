const express = require("express");

const {
  getPipelineStats,
  getRevenue,
  getConversionRate,
  getDashboardAnalytics,
} = require("../controllers/analyticsController");
console.log("getDashboardAnalytics:", typeof getDashboardAnalytics);

const authMiddleware = require("../middileware/authMiddleware");
const roleMiddleware = require("../middileware/roleMiddleware");

const router = express.Router();

// Pipeline Statistics
router.get(
  "/pipeline",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  getPipelineStats
);

// Revenue Analytics
router.get(
  "/revenue",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  getRevenue
);

// Conversion Rate Analytics
router.get(
  "/conversion-rate",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  getConversionRate
);

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  getDashboardAnalytics
);

module.exports = router;