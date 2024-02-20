const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");
  //const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

module.exports = { verifyToken };
