const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
//const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
//const mongoose = require("mongoose");
const { connectDB } = require("./utils/mongoDB");
const tourRoutes = require("./routes/TourRoute");
const userRoutes = require("./routes/UserRoute");
const orderRoutes = require("./routes/OrderRoute"); // Đảm bảo đường dẫn đến OrderRoute đúng
const cartRoutes = require("./routes/CartRoute");
// ...

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/upload/images", express.static("upload/images"));

// Use Tour and User routes
app.use("/api/tour", tourRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
// Connect to Database
connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
