const express = require("express");
const router = express.Router();
const tourTypeController = require("../controllers/TourTypeController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

router.post(
  "/createTourType",
  verifyTokenCus(["admin"]),
  tourTypeController.createTourType
);

router.get(
  "/getAllTourType",
  verifyTokenCus(["admin"]),
  tourTypeController.getAllTourTypes
);

router.get(
  "/getAllTourTypeLimit",
  verifyTokenCus(["admin"]),
  tourTypeController.getAllTourTypesLimit
);

router.put(
  "/updateType/:id",
  verifyTokenCus(["admin"]),
  tourTypeController.updateTourType
);

router.delete(
  "/deleteType/:id",
  verifyTokenCus(["admin"]),
  tourTypeController.deleteTourType
);

router.get("/getTourType/:id", tourTypeController.getTourTypeById);

module.exports = router;
