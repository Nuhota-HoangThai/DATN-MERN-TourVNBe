const Review = require("../models/Review");
const Tour = require("../models/Tour");
const User = require("../models/User"); // Ensure you have the User model

exports.createReview = async (req, res) => {
  const { tourId } = req.params;
  const userId = req.user.id; // Assuming req.user.id stores the ID of the logged-in user
  const reviewData = { ...req.body, tourId, userId }; // Include userId in the review document

  try {
    const savedReview = await new Review(reviewData).save();

    // Update the tour to include the new review
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
  const { tourId } = req.params;

  try {
    // Fetch the tour along with its reviews. Assume that each review has a userId field to reference the user
    const tourWithReviews = await Tour.findById(tourId).populate({
      path: "reviews",
      model: "ReviewTour",
      populate: {
        path: "userId",
        model: "User",
      },
    });
    // .populate({
    //   path: "reviews.userId",
    //   model: "User",
    // });

    if (!tourWithReviews) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Optionally, you might want to just send the reviews rather than the whole tour document
    res.status(200).json({ success: true, reviews: tourWithReviews.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};

module.exports = exports;
