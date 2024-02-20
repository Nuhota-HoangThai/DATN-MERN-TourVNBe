const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  regions: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number },
  desc: {
    type: String,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },

  date: { type: Date, default: Date.now },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
