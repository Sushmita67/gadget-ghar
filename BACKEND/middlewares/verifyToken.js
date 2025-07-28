const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isLoggedIn = async (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Request" });
    }

    // Token verify
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or Expired Token" });
      }

      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies?.token;
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Request" });
    }

    // Token verify
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or Expired Token" });
      }

      // Check if user is admin
      if (decoded.role !== 'admin') {
        return res
          .status(403)
          .json({ success: false, message: "Admin access required" });
      }

      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
