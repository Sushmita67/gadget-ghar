const express = require("express");
const router = express.Router();
const { validateAndSanitizeUserInput } = require("../middlewares/sanitizeMiddleware");

const { signup, login, logout, verifyEmail, resetPasswordRequest, resetPassword } = require("../controllers/authController");
const upload = require("../middlewares/multer");

// Apply sanitization to user routes
router.post("/signup", upload.single('image'), validateAndSanitizeUserInput, signup);
router.post("/login", validateAndSanitizeUserInput, login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", validateAndSanitizeUserInput, resetPasswordRequest);
router.post("/reset-password", validateAndSanitizeUserInput, resetPassword);

module.exports = router;
