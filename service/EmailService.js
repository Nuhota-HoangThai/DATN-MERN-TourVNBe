const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailService = async (email, content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"ViVu3Mien gui hoa don den cho quy khach hang" <nguyenhoangthai0134@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Hoa don dat tour cua quy khach", // Subject line
    text: "Hello world?",
    html: content,
  });
  return info;
};

module.exports = { sendEmailService };
