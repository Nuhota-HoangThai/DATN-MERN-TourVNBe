const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");

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

  tourController.addTour
);

// Remove a tour
router.delete("/removeTour/:id", tourController.removeTour);

// Get all tours
router.get("/getAllTours", tourController.getAllTours);

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
  tourController.updateTour
);

router.get("/getTourById/:tourId", tourController.getTourById);
router.get("/getTourType/:tourTypeId", tourController.getToursByTourTypeId);

module.exports = router;
