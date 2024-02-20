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
// API Creation
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

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

// const express = require("express");
// const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const { connectDB } = require("./utils/mongoDB");
// const { error } = require("console");

// dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;

// // middleware
// app.use(cors());
// app.use(express.json());

// // API Creation
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Image Storage Engine
// const storage = multer.diskStorage({
//   destination: "./upload/images/",
//   filename: (req, file, cb) => {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({ storage: storage });

// // Creating Upload Endpoint for images
// app.use("/images", express.static("upload/images"));

// app.post("/upload", upload.single("tour"), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: `http://localhost:${port}/images/${req.file.filename}`,
//   });
// });

// // Schema for Creating Tour
// const Tour = mongoose.model("Tour", {
//   id: {
//     type: Number,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   //regions: vung mien
//   regions: {
//     type: String,
//     required: true,
//   },
//   new_price: {
//     type: Number,
//     required: true,
//   },
//   old_price: { type: Number, required: true },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   //avilable: co san
//   avilable: {
//     type: Boolean,
//     default: true,
//   },
// });
// app.post("/add_tour", async (req, res) => {
//   let tours = await Tour.find({});
//   let id;
//   if (tours.length > 0) {
//     let last_tour_array = tours.slice(-1);
//     let last_tour = last_tour_array[0];
//     id = last_tour.id + 1;
//   } else {
//     id = 1;
//   }
//   const tour = new Tour({
//     id: id,
//     name: req.body.name,
//     image: req.body.image,
//     regions: req.body.regions,
//     new_price: req.body.new_price,
//     old_price: req.body.old_price,
//   });
//   console.log(tour);
//   await tour.save();
//   console.log("Saved");
//   res.json({
//     success: true,
//     name: req.body.name,
//   });
// });

// // Creating API For deleting Tours
// app.post("/remove_tour", async (req, res) => {
//   await Tour.findOneAndDelete({
//     id: req.body.id,
//   });
//   console.log("Removed");
//   res.json({ success: true, name: req.body.name });
// });

// // Creating API for Getting all tour
// app.get("/get_all_tour", async (req, res) => {
//   let tours = await Tour.find({});
//   // console.log("All Tours Fetched");
//   res.send(tours);
// });

// // Schema creating for user model
// const Users = mongoose.model("Users", {
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//   phone: {
//     type: Number,
//   },
//   cartData: {
//     type: Object,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const saltRounds = 10;
// // Creating Endpoint for registering the user
// app.post("/signup", async (req, res) => {
//   try {
//     let check = await Users.findOne({ email: req.body.email });
//     if (check) {
//       return res.status(400).json({
//         success: false,
//         error: "existing user found with same email address",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

//     let cart = {};
//     for (let i = 0; i < 300; i++) {
//       cart[i] = 0;
//     }
//     const user = new Users({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//       phone: req.body.phone,
//       cartData: cart,
//     });

//     await user.save();

//     const data = {
//       user: {
//         id: user.id,
//       },
//     };
//     const token = jwt.sign(data, "secret_ecom");
//     res.json({ success: true, token });
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// // creating login
// app.post("/login", async (req, res) => {
//   try {
//     let user = await Users.findOne({ email: req.body.email });
//     if (user) {
//       const passCompare = await bcrypt.compare(
//         req.body.password,
//         user.password
//       );
//       if (passCompare) {
//         const data = {
//           user: {
//             id: user.id,
//           },
//         };
//         const token = jwt.sign(data, "secret_ecom");
//         res.json({ success: true, token });
//       } else {
//         res.json({ success: false, error: "Wrong Password" });
//       }
//     } else {
//       res.json({ success: false, error: "Wrong Email" });
//     }
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });

// //Creating endpoint for new collection data
// app.get("/new_collection", async (req, res) => {
//   let tours = await Tour.find({});
//   let newCollection = tours.slice(1).slice(-8);
//   //console.log("New Collection");
//   res.send(newCollection);
// });

// // Creating endpoint for popular in cental region section
// app.get("/popular_in_central", async (req, res) => {
//   let tours = await Tour.find({ regions: "mt" });
//   let popular_in_central = tours.slice(0, 4);
//   //console.log("Popular in central ");
//   res.send(popular_in_central);
// });

// // Creating middelware to fetch user
// const fetchUser = async (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) {
//     res.status(401).send({ error: "Please authenticate using valid token" });
//   }
//   // Check if the token is blacklisted
//   const isBlacklisted = await TokenBlacklist.findOne({ token });
//   if (isBlacklisted) {
//     return res.status(401).send({ error: "Token has been logged out" });
//   }
//   try {
//     const data = jwt.verify(token, "secret_ecom");
//     req.user = data.user;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: "Authentication failed" });
//   }
// };

// // Creating endpoint for adding tours in cartdata
// app.post("/add_to_cart", fetchUser, async (req, res) => {
//   //console.log("added", req.body.itemId);
//   let userData = await Users.findOne({ _id: req.user.id });
//   userData.cartData[req.body.itemId] += 1;
//   await Users.findOneAndUpdate(
//     { _id: req.user.id },
//     { cartData: userData.cartData }
//   );
//   res.send("Added");
// });

// // Creating endpoint to remove product from cartdata
// app.post("/remove_tour", fetchUser, async (req, res) => {
//   //console.log("remove", req.body.itemId);
//   let userData = await Users.findOne({ _id: req.user.id });
//   if (userData.cartData[req.body.itemId] > 0)
//     userData.cartData[req.body.itemId] -= 1;
//   await Users.findOneAndUpdate(
//     { _id: req.user.id },
//     { cartData: userData.cartData }
//   );
//   res.send("Remove Success");
// });

// //creating endpoint to get cartdata
// app.post("/get_cart", fetchUser, async (req, res) => {
//   console.log("Get Cart");
//   let userData = await Users.findOne({ _id: req.user.id });
//   res.json(userData.cartData);
// });

// //

// //Connect DB
// connectDB();

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
