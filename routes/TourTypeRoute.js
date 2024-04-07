const express = require("express");
const router = express.Router();
const tourTypeController = require("../controllers/TourTypeController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

router.post(
  "/createTourType",
  verifyTokenCus(["admin", "staff"]),
  tourTypeController.createTourType
);

router.get(
  "/getAllTourType",
  verifyTokenCus(["admin", "staff"]),
  tourTypeController.getAllTourTypes
);

router.get(
  "/getAllTourTypeLimit",
  verifyTokenCus(["admin", "staff"]),
  tourTypeController.getAllTourTypesLimit
);

router.put(
  "/updateType/:id",
  verifyTokenCus(["admin", "staff"]),
  tourTypeController.updateTourType
);

router.delete(
  "/deleteType/:id",
  verifyTokenCus(["admin", "staff"]),
  tourTypeController.deleteTourType
);

router.get(
  "/getTourType/:id",
  // verifyTokenCus(["admin", "staff"]),
  tourTypeController.getTourTypeById
);

module.exports = router;
