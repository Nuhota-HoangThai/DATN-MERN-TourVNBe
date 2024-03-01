const jwt = require("jsonwebtoken");
const verifyTokenCompany = async (req, res, next) => {
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
    if (data.user.role == "company") return next();
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

module.exports = { verifyTokenCompany };
