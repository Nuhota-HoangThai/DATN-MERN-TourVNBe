const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const { verifyToken } = require("../middleware/verifyToken");
const { verifyTokenCus } = require("../middleware/verifyTokenCus");

const { upload, checkImagesUploaded } = require("../config/uploadConfig");

router.get("/:tourId", ReviewController.getReviews);

//lấy các tour có ít nhất 1 review
router.get(
  "/getReviews/haveTourReview",
  verifyTokenCus(["admin"]),
  ReviewController.getToursWithReviews
);

router.post(
  "/:tourId",
  upload.fields([{ name: "image", maxCount: 20 }, { name: "video" }]),
  checkImagesUploaded,
  verifyToken,
  ReviewController.createReview
);

// router.put(
//   "/updateReview/:reviewId",
//   verifyToken,
//   ReviewController.updateReview
// );

router.delete(
  "/deleteReview/:reviewId",
  verifyToken,
  ReviewController.deleteReview
);

router.delete(
  "/deleteReviewAdmin/:reviewId",
  verifyTokenCus(["admin"]),
  ReviewController.deleteReviewAdmin
);

router.get(
  "/reviewDetail/:reviewId",
  verifyToken,
  ReviewController.getReviewDetail
);

router.get(
  "/reviewUser/allReviewOfUser",
  verifyToken,
  ReviewController.getUserReviews
);

module.exports = router;
