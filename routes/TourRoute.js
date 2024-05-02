const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

const { upload, checkImagesUploaded } = require("../config/uploadConfig");

// Add a new tour
router.post(
  "/addTour",
  upload.fields([{ name: "image", maxCount: 20 }, { name: "video" }]),
  checkImagesUploaded,
  verifyTokenCus(["admin"]),
  tourController.addTour
);

// Remove a tour
router.delete(
  "/removeTour/:id",
  verifyTokenCus(["admin"]),
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
  verifyTokenCus(["admin"]),
  tourController.updateTour
);

router.get("/getTourById/:tourId", tourController.getTourById);

router.get("/getTourType/:tourTypeId", tourController.getToursByTourTypeId);
router.get(
  "/getTourDirectory/:tourDirectoryId",
  tourController.getToursByTourDirectoryId
);

// tour các nhân của hdv
router.get(
  "/getTourGuide/:userGuideId",
  verifyTokenCus(["admin", "guide"]),
  tourController.getToursByGuide
);

router.get(
  "/getAllTourGuide",
  verifyTokenCus(["admin"]),
  tourController.getAllToursGuide
);

router.get("/promotion/:promotionId", tourController.getToursByPromotionId);

router.get("/search", tourController.searchToursAdvanced);

module.exports = router;
