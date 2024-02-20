const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: Number },
  address: { type: String },

  cartData: { type: Object },
  date: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "tour_organizer", "customer"],
    default: "customer",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
