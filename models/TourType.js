const mongoose = require("mongoose");

const tourTypeSchema = new mongoose.Schema({
  typeName: { type: String, required: true },
  description: { type: String },
});

const TourType = mongoose.model("TourType", tourTypeSchema);

module.exports = TourType;
