const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    tourType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },

    nameTour: { type: String, required: true },
    image: [{ type: String, required: true }],
    regions: { type: String, required: true },
    price: { type: Number, required: true },
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
