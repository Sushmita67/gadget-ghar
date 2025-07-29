const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductByName,
  blacklistProduct,
  removeFromBlacklist,
} = require("../controllers/productController");
const { isLoggedIn, isAdmin } = require("../middlewares/verifyToken");
const upload = require('../middlewares/multer');

router.route("/create-product").post(isAdmin, upload.array('image', 5), createProduct);

router.route("/update-product/:id").put(isAdmin, updateProduct);
router.route("/delete-product/:id").delete(isAdmin, deleteProduct);
router.route("/get-products").get(getProducts);
router.route("/get-product/:name").get(getProductByName);
router.route("/blacklist/:id").put(isAdmin, blacklistProduct);
router.route("/remove-blacklist/:id").put(isAdmin, removeFromBlacklist);

module.exports = router;
