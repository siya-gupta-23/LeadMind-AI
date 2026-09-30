const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware ne req.user mein JWT ki information attach ki hai
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check karo user ka role allowed hai ya nahi
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission.",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;