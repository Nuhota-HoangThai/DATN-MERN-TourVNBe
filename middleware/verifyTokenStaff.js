const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyTokenAdmin = async (req, res, next) => {
  const token = req.header("Authorization"); // Đảm bảo đúng tên header

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded.user;
    if (decoded.user.role === "staff") {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

module.exports = { verifyTokenAdmin };
