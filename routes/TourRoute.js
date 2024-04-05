const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

const multer = require("multer");
const path = require("path");

// Cấu hình chung cho việc lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Kiểm tra loại file để quyết định thư mục lưu trữ
    if (file.mimetype.startsWith("image/")) {
      cb(null, "upload/images/");
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "upload/videos/");
    } else {
      // Loại file không được hỗ trợ
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất
    cb(null, Date.now() + path.extname(file.originalname));
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
    // Loại file không được chấp nhận
    cb(
      new Error("Invalid file type, only images and videos are allowed!"),
      false
    );
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware để kiểm tra ít nhất một hình ảnh được upload
const checkImagesUploaded = (req, res, next) => {
  if (!req.files["image"] || req.files["image"].length === 0) {
    return res.status(400).send("At least one image is required.");
  }
  next();
};

// Add a new tour
router.post(
  "/addTour",
  upload.fields([{ name: "image", maxCount: 20 }, { name: "video" }]),
  checkImagesUploaded,
  verifyTokenCus(["admin", "staff"]),
  tourController.addTour
);

// Remove a tour
router.delete(
  "/removeTour/:id",
  verifyTokenCus(["admin", "staff"]),
  tourController.removeTour
);

// Get all tours
router.get("/getAllTours", tourController.getAllTours);
router.get("/getAllToursLimit", tourController.getAllToursLimit);

// Get new collection tours
router.get("/getNewCollection", tourController.getNewCollection);

// Get popular tours in the central region
router.get("/getPopularInCentral", tourController.getPopularInCentral);

// Get popular tours in the southern region
router.get("/getPopularInSouthern", tourController.getPopularInSouthern);

// Get popular tours in the north region
router.get("/getPopularInNorth", tourController.getPopularInNorth);

//Cập nhật tour
router.put(
  "/update_tour/:id",
  upload.fields([{ name: "image", maxCount: 20 }, { name: "video" }]),
  verifyTokenCus(["admin", "staff"]),
  tourController.updateTour
);

router.get("/getTourById/:tourId", tourController.getTourById);

router.get("/getTourType/:tourTypeId", tourController.getToursByTourTypeId);

router.get("/promotion/:promotionId", tourController.getToursByPromotionId);

router.get("/search", tourController.searchToursAdvanced);

module.exports = router;
