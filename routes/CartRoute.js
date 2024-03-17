const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const { verifyToken } = require("../middleware/verifyToken");
// Định nghĩa các route
router.post("/addToCart", verifyToken, CartController.addToCart);

// Remove tour from user's cart
router.delete(
  "/removeFromCart/:id",
  verifyToken,
  CartController.removeFromCart
);

// Get user's cart data
router.get("/getCart", verifyToken, CartController.getCart);

module.exports = router;
