const express = require("express");
const { isLoggedIn } = require("../middlewares/verifyToken");
const {
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const upload = require('../middlewares/multer');

const router = express.Router();

router.put("/update-profile", isLoggedIn, upload.single('image'), updateProfile);
router.put("/update-password", isLoggedIn, updatePassword);

module.exports = router;
