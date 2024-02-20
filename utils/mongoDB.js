const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Kết nối đến MongoDB, sử dụng biến MONGO_URL từ file environment (.env)
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connect database successfully!");
  } catch (error) {
    console.error("Connect database fail!", error);
  }
};

module.exports = { connectDB };
