const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User registration
exports.signup = async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({
        success: false,
        error: "existing user found with same email address",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      cartData: cart,
    });

    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// User login
exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const passCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passCompare) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token });
      } else {
        res.json({ success: false, error: "Wrong Password" });
      }
    } else {
      res.json({ success: false, error: "Wrong Email" });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}); // Exclude passwords from the result
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body; // Extract fields you allow to update
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phone, address, email },
      { new: true, runValidators: true } // options
    );

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(updatedUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user
exports.removeUser = async (req, res) => {
  try {
    // Lấy _id từ params thay vì id
    const { id } = req.params;

    // Tìm và xóa user dựa trên _id
    const deletedUser = await User.findByIdAndDelete(id);

    // Kiểm tra xem user có tồn tại để xóa không
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Nếu tìm thấy và xóa thành công, trả về response
    res.json({
      success: true,
      message: "User successfully deleted",
      deletedUser: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting User:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting the User",
      error: error.message,
    });
  }
};

module.exports = exports;
