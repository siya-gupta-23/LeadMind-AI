const express = require("express");

const {
  signup,
  verifyOtp,
  resendOtp,
  login,
  inviteEmployee,
  deactivateEmployee,
  activateEmployee,
  getEmployees,
} = require("../controllers/authController");

const authMiddleware = require("../middileware/authMiddleware");
const roleMiddleware = require("../middileware/roleMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);

router.post("/invite-employee", authMiddleware, roleMiddleware("admin"), inviteEmployee);
router.get("/employees", authMiddleware, roleMiddleware("admin"), getEmployees);
router.put("/deactivate-employee/:id", authMiddleware, roleMiddleware("admin"), deactivateEmployee);
router.put("/activate-employee/:id", authMiddleware, roleMiddleware("admin"), activateEmployee);

module.exports = router;