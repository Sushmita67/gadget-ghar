const express = require("express");

const router = express.Router();

const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");
const {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  getMetrics,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/create-order", isLoggedIn, createOrder);
router.get("/get-order", isLoggedIn, getOrdersByUserId);
router.get("/get-orders", isAdmin, getAllOrders);
router.get("/get-metrics", isAdmin, getMetrics);
router.put("/update-status/:paymentId", isAdmin, updateOrderStatus);

module.exports = router;
