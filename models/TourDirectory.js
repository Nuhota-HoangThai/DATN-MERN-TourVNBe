const mongoose = require("mongoose");

const tourDirectorySchema = new mongoose.Schema({
  directoryName: { type: String, required: true },
  directoryDescription: { type: String },
});

const TourDirectory = mongoose.model("TourDirectory", tourDirectorySchema);

module.exports = TourDirectory;
