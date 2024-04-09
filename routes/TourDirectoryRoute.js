const express = require("express");
const router = express.Router();
const tourDirectoryController = require("../controllers/TourDirectoryController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");
const { upload } = require("../config/uploadImage");

// Tạo một danh mục tour mới
router.post(
  "/createTourDirectory",
  upload.single("image"),
  verifyTokenCus(["admin", "staff"]),
  tourDirectoryController.createTourDirectory
);

// Lấy tất cả các danh mục tour
router.get(
  "/getAllTourDirectories",
  tourDirectoryController.getAllTourDirectories
);

router.get(
  "/getAllTourDirectoriesLimit",
  tourDirectoryController.getAllTourDirectoriesLimit
);

// Cập nhật thông tin của một danh mục tour
router.put(
  "/updateDirectory/:id",
  verifyTokenCus(["admin", "staff"]),
  tourDirectoryController.updateTourDirectory
);

// Xóa một danh mục tour
router.delete(
  "/deleteDirectory/:id",
  verifyTokenCus(["admin", "staff"]),
  tourDirectoryController.deleteTourDirectory
);

// Lấy danh mục tour theo id
router.get(
  "/getTourDirectory/:id",
  //verifyTokenCus(["admin", "staff"]),
  tourDirectoryController.getTourDirectoryById
);

module.exports = router;
