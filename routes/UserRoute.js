const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// User registration
router.post("/signup", userController.signup);

// User login
router.post("/login", userController.login);

router.get("/get_all_users", userController.getAllUsers);
router.put("/update_user/:id", userController.updateUser);
router.delete("/removeUser/:id", userController.removeUser);

// Add tour to user's cart
// router.post("/addToCart", verifyToken, userController.addToCart);

// // Remove tour from user's cart
// router.post("/removeFromCart", verifyToken, userController.removeFromCart);

// // Get user's cart data
// router.post("/getCart", verifyToken, userController.getCart);

module.exports = router;
