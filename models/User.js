const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourGuide",
  },
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: Number },
  address: { type: String },
  image: { type: String },
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
