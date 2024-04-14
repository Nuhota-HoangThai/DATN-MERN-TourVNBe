const express = require("express");
const blogController = require("../controllers/BlogController");
const { verifyTokenCus } = require("../middleware/verifyTokenCus");

const { upload } = require("../config/uploadImage");

const router = express.Router();

// lấy tất cả bài viết
router.get("/getAll", blogController.getAllBlogsLimitAdmin);
router.get("/getAllUser", blogController.getAllBlogs);

// tạo mới một bài viết
router.post(
  "/create",
  upload.single("image"),
  verifyTokenCus(["admin", "staff"]),
  blogController.createBlog
);

// lấy một bài viết theo ID
router.get("/detail/:id", blogController.getBlogById);

// cập nhật một bài viết theo ID
router.put(
  "/update/:id",
  upload.single("image"),
  verifyTokenCus(["admin", "staff"]),
  blogController.updateBlog
);

// xóa một bài viết theo ID
router.delete(
  "/delete/:id",
  verifyTokenCus(["admin", "staff"]),
  blogController.deleteBlog
);

module.exports = router;
