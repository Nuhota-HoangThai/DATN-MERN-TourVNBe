const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");
const { verifyToken } = require("../middleware/verifyToken");

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

// User login
router.post("/login", userController.login);

router.post("/login-google", userController.google);

// add user
router.post("/addUser", verifyTokenCus(["admin"]), userController.addUser);

router.get(
  "/get_all_users",
  verifyTokenCus(["admin"]),
  userController.getAllUsers
);

router.get(
  "/get_all_usersLimitAdmin",
  verifyTokenCus(["admin"]),
  userController.getAllUsersLimitAdmin
);

router.get(
  "/get_all_usersLimitStaff",
  verifyTokenCus(["admin"]),
  userController.getAllUsersLimitStaff
);

router.get(
  "/get_all_usersGuide",
  verifyTokenCus(["admin"]),
  userController.getAllUsersGuide
);

router.get(
  "/get_all_usersLimitGuide",
  verifyTokenCus(["admin"]),
  userController.getAllUsersLimitGuide
);

router.get(
  "/get_all_usersLimitCustomer",
  verifyTokenCus(["admin"]),
  userController.getAllUsersLimitCustomer
);

router.put(
  "/update_user/:id",
  upload.single("image"),
  verifyToken,
  userController.updateUser
);

router.delete(
  "/removeUser/:id",
  verifyTokenCus(["admin"]),
  userController.removeUser
);

router.get("/getUserById/:id", verifyToken, userController.getUserById);

module.exports = router;
