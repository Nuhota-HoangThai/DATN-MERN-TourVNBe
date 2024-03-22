const express = require("express");
const router = express.Router();

const ReviewController = require("../controllers/ReviewController");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/:tourId", ReviewController.getReviews);

router.post("/:tourId", verifyToken, ReviewController.createReview);

//router.post("/reviews", verifyToken, ReviewController.addReview);

module.exports = router;
