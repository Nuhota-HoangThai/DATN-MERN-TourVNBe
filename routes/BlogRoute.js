const express = require("express");
const blogController = require("../controllers/BlogController");
const { verifyTokenCus } = require("../middleware/verifyTokenCus");

const router = express.Router();

// lấy tất cả bài viết
router.get("/getAll", blogController.getAllBlogs);
router.get("/getAllLimit", blogController.getAllBlogsLimit);

// tạo mới một bài viết
router.post(
  "/create",
  verifyTokenCus(["admin", "staff"]),
  blogController.createBlog
);

// lấy một bài viết theo ID
router.get("/detail/:id", blogController.getBlogById);

// cập nhật một bài viết theo ID
router.put(
  "/update/:id",
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
