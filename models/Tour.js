const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nameTour: { type: String, required: true },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  image: [{ type: String, required: true }],
  regions: { type: String, required: true },
  price: { type: Number, required: true },
  description: {
    type: String,
    required: true,
  },
  timeTravel: { type: String },
  maxParticipants: {
    type: Number,
    required: true,
  },
  convergeTime: { type: Date },
  tourGuide: { type: String },
  promotion: {
    type: String,
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;