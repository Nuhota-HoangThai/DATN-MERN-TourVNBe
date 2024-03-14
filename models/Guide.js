const mongoose = require("mongoose");

const tourGuideSchema = new mongoose.Schema({
  wage: { type: Number, required: true },
  hasTour: { type: Boolean, default: false },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

module.exports = TourGuide;
