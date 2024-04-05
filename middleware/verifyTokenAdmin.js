const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyTokenAndAdmin = async (req, res, next) => {
  const token = req.header(process.env.AUTH_TOKEN_HEADER);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
  }
  // console.log(token);
  try {
    const data = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = data.user;

    // Kiểm tra vai trò của người dùng
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

module.exports = { verifyTokenAndAdmin };
