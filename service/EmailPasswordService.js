const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailPassword = async (email, content) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // `secure` is false because port 587 starts in plain text and then encrypts the connection using STARTTLS. If using port 465, set `secure` to true.
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },
  });

  const info = await transporter.sendMail({
    from: '"ViVu3Mien gửi link tạo mật khẩu mới cho quý khach hàng" <nguyenhoangthai0134@gmail.com>', // Use your actual sender address
    to: email,
    subject: "Bạn đang muốn tạo mật khẩu mới?",
    text: "Chào bạn?",
    html: content,
  });

  return info;
};

module.exports = { sendEmailPassword };
