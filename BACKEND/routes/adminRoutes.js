const express = require("express");
const router = express.Router();
const { validateAndSanitizeUserInput } = require("../middlewares/sanitizeMiddleware");

const { adminSignup, adminLogin } = require("../controllers/authController");

// Apply sanitization to admin routes
router.post("/signup", validateAndSanitizeUserInput, adminSignup);
router.post("/login", validateAndSanitizeUserInput, adminLogin);

module.exports = router;
