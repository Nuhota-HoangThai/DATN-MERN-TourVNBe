const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

const { verifyTokenAdmin } = require("../middleware/verifyTokenAdmin");

const multer = require("multer");
const path = require("path");

// Cấu hình multer như đã mô tả ở trên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// User registration
router.post("/signup", userController.signup);

// add user
router.post("/addUser", userController.addUser);

// User login
router.post("/login", userController.login);

router.get("/get_all_users", userController.getAllUsers);

router.put(
  "/update_user/:id",
  upload.single("image"),
  userController.updateUser
);

router.delete("/removeUser/:id", userController.removeUser);
router.get("/getUserById/:id", userController.getUserById);

module.exports = router;