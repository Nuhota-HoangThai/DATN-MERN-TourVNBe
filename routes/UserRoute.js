const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { verifyTokenAdmin } = require("../middleware/verifyTokenAdmin");
// User registration
router.post("/signup", userController.signup);

// add user
router.post("/addUser", userController.addUser);

// User login
router.post("/login", userController.login);

router.get("/get_all_users", userController.getAllUsers);
router.put("/update_user/:id", userController.updateUser);
router.delete("/removeUser/:id", userController.removeUser);
router.get("/getUserById/:id", userController.getUserById);

module.exports = router;
