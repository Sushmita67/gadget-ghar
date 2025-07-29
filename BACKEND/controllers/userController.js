const User = require("../models/user");
const { ROLES } = require("../utils/constants");
const bcrypt = require("bcryptjs");

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req;
    if (req.role !== ROLES.user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { fullName, email, phone } = req.body;
    const image = req.file; // multer single file

    if (image) {
      user.profileImg = {
        url: '/uploads/' + image.filename
      };
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImg: updatedUser.profileImg.url,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req;
    const { previousPassword, newPassword } = req.body;

    if (req.role !== ROLES.user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatched = await bcrypt.compare(previousPassword, user.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Previous password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
