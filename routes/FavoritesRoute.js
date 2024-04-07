const express = require("express");
const router = express.Router();
const favoritesController = require("../controllers/FavoritesController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/addFavorites", verifyToken, favoritesController.addFavorite);

router.get(
  "/userFavorites/:userId",
  verifyToken,
  favoritesController.getFavorites
);

router.delete(
  "/removeFavorites",
  verifyToken,
  favoritesController.removeFavorite
);

module.exports = router;
