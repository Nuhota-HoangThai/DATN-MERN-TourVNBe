const User = require("../models/User");

// Add tour to user's cart
exports.addToCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).send("User not found");
    }
    if (!userData.cartData) {
      userData.cartData = {};
    }
    const itemId = req.body.itemId;
    userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Added");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

// Remove tour from user's cart
exports.removeFromCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData || !userData.cartData) {
      return res.status(404).send("User not found or cart is empty");
    }
    const itemId = req.body.itemId;
    if (userData.cartData[itemId] > 0) {
      userData.cartData[itemId] -= 1;
    }
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Remove Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

// Get user's cart data
exports.getCart = async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).send("User not found");
    }
    res.json(userData.cartData);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

module.exports = exports;
