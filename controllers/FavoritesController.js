const Favorites = require("../models/Favorites");

const favoritesController = {
  // Add a tour to a user's favorites
  addFavorite: async (req, res) => {
    const { userId, tourId } = req.body;

    try {
      // Check if the tour is already in the user's favorites
      const existingFavorite = await Favorites.findOne({ userId, tourId });
      if (existingFavorite) {
        return res
          .status(409)
          .json({ message: "Tour is already in favorites" });
      }

      const favorite = new Favorites({ userId, tourId });
      await favorite.save();
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to favorites", error });
    }
  },

  // Get all favorite tours for a user
  getFavorites: async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    try {
      const favorites = await Favorites.find({ userId }).populate("tourId");
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve favorites", error });
    }
  },

  // Remove a tour from a user's favorites
  removeFavorite: async (req, res) => {
    const { userId, tourId } = req.body;

    try {
      const favorite = await Favorites.findOneAndDelete({ userId, tourId });
      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to remove from favorites", error });
    }
  },
};

module.exports = favoritesController;
