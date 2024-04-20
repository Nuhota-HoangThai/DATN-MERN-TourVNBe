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
          .json({ message: "Chuyến tham quan đã được yêu thíchs" });
      }

      const favorite = new Favorites({ userId, tourId });
      await favorite.save();
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Không thể thêm vào mục yêu thích" });
    }
  },

  // Get all favorite tours for a user
  getFavorites: async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    try {
      const favorites = await Favorites.find({ userId }).populate("tourId");
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Không thể truy xuất mục yêu thích" });
    }
  },

  // Remove a tour from a user's favorites
  removeFavorite: async (req, res) => {
    const { userId, tourId } = req.body;

    try {
      const favorite = await Favorites.findOneAndDelete({ userId, tourId });
      if (!favorite) {
        return res.status(404).json({ error: "Không tìm thấy yêu thích" });
      }
      res.status(200).json({ message: "Đã xóa khỏi mục yêu thích" });
    } catch (error) {
      res.status(500).json({ error: "Không thể xóa khỏi mục yêu thích" });
    }
  },
};

module.exports = favoritesController;
