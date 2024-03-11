const express = require("express");
const router = express.Router();
const tourTypeController = require("../controllers/TourTypeController");

router.post("/createTourType", tourTypeController.createTourType);
router.get("/getAllTourType", tourTypeController.getAllTourTypes);
router.put("/updateType/:id", tourTypeController.updateTourType);
router.delete("/deleteType/:id", tourTypeController.deleteTourType);
router.get("/getTourType/:id", tourTypeController.getTourTypeById);

module.exports = router;
