const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

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

// Add a new tour
router.post(
  "/addTour",
  upload.array("image", 5),
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
router.get(
  "/getAllTours",
  //verifyTokenCus(["admin", "staff"]),
  tourController.getAllTours
);

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
  upload.array("image", 5),
  verifyTokenCus(["admin", "staff"]),
  tourController.updateTour
);

router.get(
  "/getTourById/:tourId",
  // verifyTokenCus(["admin", "staff"]),
  tourController.getTourById
);

router.get(
  "/getTourType/:tourTypeId",
  //verifyTokenCus(["admin", "staff"]),
  tourController.getToursByTourTypeId
);

router.get("/promotion/:promotionId", tourController.getToursByPromotionId);

router.get("/search", tourController.searchToursAdvanced);

module.exports = router;
