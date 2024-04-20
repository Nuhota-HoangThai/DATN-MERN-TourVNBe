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
      return res
        .status(404)
        .json({ error: "Không tìm thấy người dùng hoặc giỏ hàng trống" });
    }
    const itemId = req.params.id;
    if (userData.cartData[itemId] > 0) {
      userData.cartData[itemId] -= 1;
    }
    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("Xóa thành công");
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi");
  }
};

// Get user's cart data
exports.getCart = async (req, res) => {
  try {
    const id = req.user.id;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }
    res.json(userData.cartData);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

module.exports = exports;
