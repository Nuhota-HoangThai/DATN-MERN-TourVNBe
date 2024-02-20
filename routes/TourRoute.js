const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");

// Add a new tour
router.post("/addTour", tourController.addTour);

// Remove a tour
router.delete("/removeTour/:id", tourController.removeTour);

// Get all tours
router.get("/getAllTours", tourController.getAllTours);

// Get new collection tours
router.get("/getNewCollection", tourController.getNewCollection);

// Get popular tours in the central region
router.get("/getPopularInCentral", tourController.getPopularInCentral);

// search

//Cập nhật tour
router.put("/update_tour/:id", tourController.updateTour);
module.exports = router;
