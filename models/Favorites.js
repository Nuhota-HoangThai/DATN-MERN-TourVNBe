const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
    },
  },
  { timestamps: true }
);

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorites;
