const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    tourType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },

    // reviews: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ReviewTour",
    //   required: true,
    // },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    nameTour: { type: String, required: true },
    image: [{ type: String, required: true }],
    regions: { type: String, required: true },
    price: { type: Number, required: true },
    // Giá cho trẻ em từ 2 đến 12 tuổi
    priceForChildren: {
      type: Number,
    },
    // Giá cho bé dưới 2 tuổi
    priceForInfants: {
      type: Number,
    },
    // Phụ thu khác
    additionalFees: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    timeTravel: { type: String },
    convergeTime: { type: Date },
    startingGate: { type: String },
    description: {
      type: String,
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    AccessTour: {
      type: String,
      enum: ["allAge", "adultsOnly"],
      default: "allAge",
    },
    tourGuide: { type: String },
    promotion: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
