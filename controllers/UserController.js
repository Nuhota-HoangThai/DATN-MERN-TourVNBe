const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User registration
exports.signup = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
    }

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
      //role: req.body.role,
    });

    await user.save();

    const data = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: false, error: "Email không tồn tại" });
    }

    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (!passCompare) {
      return res.json({ success: false, error: "Sai mật khẩu" });
    }

    const data = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role, // Thêm vai trò người dùng vào token
      },
    };

    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Phản hồi bổ sung thông tin về vai trò của người dùng
    res.json({
      success: true,
      token,
      id: user._id,
      name: user.name,
      role: user.role, // Trả về vai trò người dùng để ứng dụng client có thể xử lý tương ứng
    });
  } catch (error) {
    res.status(500).send("Lỗi máy chủ nội bộ");
  }
};

// Google login or registration
exports.google = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    let token;

    if (!user) {
      // Nếu người dùng không tồn tại, tạo một người dùng mới
      user = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        cartData: cart,
      });

      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        token,
        role: user.role,
      },
    };

    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
      success: true,
      token,
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllUsersLimitAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 6; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    const roleQuery = { role: "admin" };

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalUser = await User.countDocuments(roleQuery);
    const totalPages = Math.ceil(totalUser / limit);

    const users = await User.find(roleQuery)
      .sort({ date: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);
    res.send({ users, page, limit, totalPages, totalUser });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllUsersLimitAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 6; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    const roleQuery = { role: "admin" };

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalUser = await User.countDocuments(roleQuery);
    const totalPages = Math.ceil(totalUser / limit);

    const users = await User.find(roleQuery)
      .sort({ date: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);
    res.send({ users, page, limit, totalPages, totalUser });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllUsersLimitStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 6; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    const roleQuery = { role: "staff" };

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalUser = await User.countDocuments(roleQuery);
    const totalPages = Math.ceil(totalUser / limit);

    const users = await User.find(roleQuery)
      .sort({ date: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);
    res.send({ users, page, limit, totalPages, totalUser });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
exports.getAllUsersLimitGuide = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 6; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    const roleQuery = { role: "guide" };

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalUser = await User.countDocuments(roleQuery);
    const totalPages = Math.ceil(totalUser / limit);

    const users = await User.find(roleQuery)
      .sort({ date: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);
    res.send({ users, page, limit, totalPages, totalUser });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
exports.getAllUsersLimitCustomer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 6; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    const roleQuery = { role: "customer" };

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalUser = await User.countDocuments(roleQuery);
    const totalPages = Math.ceil(totalUser / limit);

    const users = await User.find(roleQuery)
      .sort({ date: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);
    res.send({ users, page, limit, totalPages, totalUser });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  let update = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    cccd: req.body.cccd,
    role: req.body.role,
  };

  if (req.file) {
    update.image = req.file.path;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
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

// Lấy user theo id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    // Tìm user bằng id
    const user = await User.findById(id);

    // Kiểm tra xem user có tồn tại không
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Nếu user tồn tại, trả về user
    res.json({ success: true, user: user });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({
      success: false,
      message: "Error finding the user",
      error: error.message,
    });
  }
};

// add user danh cho admin
exports.addUser = async (req, res) => {
  const { name, email, password, confirmPassword, phone, role, address, cccd } =
    req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Passwords do not match",
      });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with the same email address already exists.",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo cart mặc định
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      cccd,
      cartData: cart,
      role,
      address,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Tạo token JWT cho người dùng mới
    const payload = {
      user: {
        id: newUser.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Phản hồi thành công cùng với token
    res.json({
      success: true,
      message: "User added successfully.",
      token,
    });
  } catch (error) {
    console.error("addUser error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = exports;
