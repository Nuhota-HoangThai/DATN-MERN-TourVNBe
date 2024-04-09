// uploadConfig.js
const multer = require("multer");
const path = require("path");

// Cấu hình chung cho việc lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "upload/images/");
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "upload/videos/");
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

// Tùy chọn fileFilter để chỉ chấp nhận hình ảnh và video
const fileFilter = function (req, file, cb) {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only images and videos are allowed!"),
      false
    );
  }
};

// Middleware để kiểm tra ít nhất một hình ảnh được upload
const checkImagesUploaded = (req, res, next) => {
  if (!req.files["image"] || req.files["image"].length === 0) {
    return res.status(400).send("At least one image is required.");
  }
  next();
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { upload, checkImagesUploaded };
