const express = require("express");
const router = express.Router();
const tourDirectoryController = require("../controllers/TourDirectoryController");

// Tạo một danh mục tour mới
router.post(
  "/createTourDirectory",
  tourDirectoryController.createTourDirectory
);

// Lấy tất cả các danh mục tour
router.get(
  "/getAllTourDirectories",
  tourDirectoryController.getAllTourDirectories
);

// Cập nhật thông tin của một danh mục tour
router.put("/updateDirectory/:id", tourDirectoryController.updateTourDirectory);

// Xóa một danh mục tour
router.delete(
  "/deleteDirectory/:id",
  tourDirectoryController.deleteTourDirectory
);

// Lấy danh mục tour theo id
router.get(
  "/getTourDirectory/:id",
  tourDirectoryController.getTourDirectoryById
);

module.exports = router;
