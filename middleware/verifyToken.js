const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const token = req.header(process.env.AUTH_TOKEN_HEADER);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Bạn chưa đăng nhập",
    });
  }
  //console.log(token);
  try {
    const data = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    //console.log(error);
    return res.status(400).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

module.exports = { verifyToken };
