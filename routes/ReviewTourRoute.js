const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const { verifyToken } = require("../middleware/verifyToken");

const { upload, checkImagesUploaded } = require("../config/uploadConfig");

router.get("/:tourId", ReviewController.getReviews);

router.post(
  "/:tourId",
  upload.fields([{ name: "image", maxCount: 20 }, { name: "video" }]),
  checkImagesUploaded,
  verifyToken,
  ReviewController.createReview
);

module.exports = router;
