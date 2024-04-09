const mongoose = require("mongoose");

const tourDirectorySchema = new mongoose.Schema({
  image: { type: String, required: true },
  directoryName: { type: String, required: true },
  directoryDescription: { type: String },
});

const TourDirectory = mongoose.model("TourDirectory", tourDirectorySchema);

module.exports = TourDirectory;
