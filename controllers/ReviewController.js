const Review = require("../models/Review");
const Tour = require("../models/Tour");
const Booking = require("../models/Booking");

exports.createReview = async (req, res) => {
  const tourId = req.params.tourId;
  const newReview = new Review({ ...req.body, tourId });
  try {
    const savedReview = await newReview.save();

    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id },
    });
    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

exports.getReviews = async (req, res) => {
  const tourId = req.params.tourId;

  try {
    const tourWithReviews = await Tour.findById(tourId).populate({
      path: "reviews",
      model: "ReviewTour",
    });

    if (!tourWithReviews) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    res
      .status(200)
      .json({ success: true, reviews: tourWithReviews.reviews || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};

module.exports = exports;
