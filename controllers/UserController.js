const User = require("../models/User");
const Tour = require("../models/Tour");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { sendEmailPassword } = require("../service/EmailPasswordService");

// User registration
exports.signup = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Mật khẩu không phù hợp",
      });
    }

    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      cccd: req.body.cccd,
      sex: req.body.sex,
      password: hashedPassword,
      phone: req.body.phone,
      dob: req.body.dob,
      cartData: cart,
      //role: req.body.role,
    });

    await user.save();
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi máy chủ nội bộ" });
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
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    // Attempt to find the user by email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ success: false, error: "Email không tồn tại" });
    }

    // Compare submitted password with the hashed password in the database
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (!passCompare) {
      return res.json({ error: "Sai mật khẩu" });
    }

    // Check user role, prevent login if user is a customer
    if (user.role === "customer") {
      return res.json({
        error: "Bạn không được phép đăng nhập vào trang này.",
      });
    }

    // If authentication is successful, prepare the user data for the JWT
    const data = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role, // Include user role
      },
    };

    // Sign the JWT token with the user data
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Respond with the JWT token and user information including the role
    res.json({
      success: true,
      token,
      id: user._id,
      name: user.name,
      role: user.role, // Return the user role for client-side handling
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
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
    res.status(500).send("Internal Server Error");
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
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

// lấy ds guide
exports.getAllUsersGuide = async (req, res) => {
  try {
    // Thêm điều kiện role: 'guide' vào phương thức find
    const users = await User.find({ role: "guide" });
    res.send(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// danh sách hien thi ở trang admin
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
      .populate("tour", "nameTour")
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
    wage: req.body.wage,
    dob: req.body.dob,
    sex: req.body.sex,
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
      return res.status(404).send({ error: "Không tìm thấy người dùng" });
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
        .json({ success: false, error: "Không tìm thấy người dùng" });
    }

    // Nếu tìm thấy và xóa thành công, trả về response
    res.json({
      success: true,
      message: "Xóa người dùng thành công",
      deletedUser: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi xóa người dùng",
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
        .json({ success: false, error: "Không tìm thấy người dùng" });
    }

    // Nếu user tồn tại, trả về user
    res.json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi tìm người dùng",
      error: error.message,
    });
  }
};

// add user danh cho admin
exports.addUser = async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    phone,
    role,
    sex,
    dob,
    address,
    cccd,
  } = req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Mật khẩu không phù hợp",
      });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email đã tồn tại",
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
      dob,
      sex,
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
      message: "Thêm người dùng thành công",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy email" });
    }

    // Tạo token với thời hạn là 10 phút
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const link = `http://localhost:5174/login/reset-password/${token}`;
    const emailContent = `Xin chào, bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấn vào link sau để đặt lại mật khẩu: <a href="${link}">${link}</a>`;

    await sendEmailPassword(user.email, emailContent);

    res.status(200).json({
      message: "Đường link tạo mật khẩu mới đã được gửi vào mail của bạn.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.newPassword = async (req, res) => {
  const { token } = req.params; // Lấy token từ params
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Mật khẩu xác nhận không khớp.");
  }

  try {
    // Xác minh token và lấy userId từ payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("Không tìm thấy người dùng.");
    }

    // Mã hóa mật khẩu mới và cập nhật trong database
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save(); // Lưu người dùng đã cập nhật

    res.send("Mật khẩu đã được đặt lại thành công.");
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .send({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = exports;
