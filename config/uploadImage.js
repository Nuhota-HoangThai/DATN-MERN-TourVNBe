const multer = require("multer");
const path = require("path");

// Cấu hình chung cho việc lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Chỉ lưu trữ hình ảnh
    if (file.mimetype.startsWith("image/")) {
      cb(null, "upload/images/");
    } else {
      cb(new Error("Invalid file type, only images are allowed!"), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
