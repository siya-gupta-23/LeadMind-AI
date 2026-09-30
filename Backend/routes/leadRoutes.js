const express = require("express");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const authMiddleware = require("../middileware/authMiddleware");
const roleMiddleware = require("../middileware/roleMiddleware");

const router = express.Router();

// Admin + Sales Executive
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  createLead
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  getLeads
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  getLeadById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "sales_executive"),
  updateLead
);

// Admin ONLY
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteLead
);

module.exports = router;