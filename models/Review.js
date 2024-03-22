const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Tour",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      // required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ReviewTour = mongoose.model("ReviewTour", reviewSchema);

module.exports = ReviewTour;
