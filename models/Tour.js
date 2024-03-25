const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    tourType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },

    tourDirectory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourDirectory",
      required: true,
    },

    tourPromotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourPromotion",
      //required: true,
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
    // Giá cho trẻ em từ 6 đến 16 tuổi
    priceForChildren: {
      type: Number,
    },

    // Giá cho trẻ em từ 3-6 tuổi
    priceForYoungChildren: {
      type: Number,
    },

    // Giá cho bé dưới 3 tuổi
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
