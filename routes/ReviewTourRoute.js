const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const { verifyToken } = require("../middleware/verifyToken");

const { upload, checkImagesUploaded } = require("../config/uploadConfig");

router.get("/:tourId", ReviewController.getReviews);

router.post(
  "/:tourId",
  upload.fields([{ name: "image", maxCount: 20 }, { name: "video" }]),
  checkImagesUploaded,
  verifyToken,
  ReviewController.createReview
);

module.exports = router;

// const multer = require("multer");
// const path = require("path");

// // Cấu hình chung cho việc lưu trữ
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Kiểm tra loại file để quyết định thư mục lưu trữ
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, "upload/images/");
//     } else if (file.mimetype.startsWith("video/")) {
//       cb(null, "upload/videos/");
//     } else {
//       // Loại file không được hỗ trợ
//       cb(new Error("Invalid file type"), false);
//     }
//   },
//   filename: function (req, file, cb) {
//     // Tạo tên file duy nhất
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // Tùy chọn fileFilter để chỉ chấp nhận hình ảnh và video
// const fileFilter = function (req, file, cb) {
//   if (
//     file.mimetype.startsWith("image/") ||
//     file.mimetype.startsWith("video/")
//   ) {
//     cb(null, true);
//   } else {
//     // Loại file không được chấp nhận
//     cb(
//       new Error("Invalid file type, only images and videos are allowed!"),
//       false
//     );
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// // Middleware để kiểm tra ít nhất một hình ảnh được upload
// const checkImagesUploaded = (req, res, next) => {
//   if (!req.files["image"] || req.files["image"].length === 0) {
//     return res.status(400).send("At least one image is required.");
//   }
//   next();
// };
