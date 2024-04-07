const express = require("express");
const dotenv = require("dotenv");
//const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const { connectDB } = require("./utils/mongoDB");

const tourRoutes = require("./routes/TourRoute");
const userRoutes = require("./routes/UserRoute");
const bookingRoutes = require("./routes/BookingRoute");
const cartRoutes = require("./routes/CartRoute");
const tourTypeRoutes = require("./routes/TourTypeRoute");
const reviewRoutes = require("./routes/ReviewTourRoute");
const tourDirectoryRoutes = require("./routes/TourDirectoryRoute");
const tourPromotionRoutes = require("./routes/TourPromotionRoute");
const statisticalRoutes = require("./routes/StatisticalRoute");
const billRoutes = require("./routes/BillRoute");
const favoritesRoute = require("./routes/FavoritesRoute");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/upload/images", express.static("upload/images"));
app.use("/api/upload/videos", express.static("upload/videos"));

// Use Tour and User routes
app.use("/api/tour", tourRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/tourType", tourTypeRoutes);
app.use("/api/tourDirectory", tourDirectoryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/tourPromotion", tourPromotionRoutes);
app.use("/api/statistical", statisticalRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/favorites", favoritesRoute);

// Connect to Database
connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
