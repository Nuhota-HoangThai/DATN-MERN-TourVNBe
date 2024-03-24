const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
  },
  image: { type: String },
  name: { type: String },
  cccd: { type: Number },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: Number },
  address: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "staff", "customer", "guide"],
    default: "customer",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
