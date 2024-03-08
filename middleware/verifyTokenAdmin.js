const jwt = require("jsonwebtoken");
const verifyTokenAdmin = async (req, res, next) => {
  const authHeader = req.header("auth-token");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.user.role === "admin") return next();
    return res.status(400).json({
      success: false,
      message: "Bạn không có quyền",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

module.exports = { verifyTokenAdmin };
