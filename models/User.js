const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, required: true },
  cccd: { type: Number, required: true },
  dob: { type: Date, required: true },
  sex: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  phone: { type: Number, required: true },
  address: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "staff", "customer", "guide"],
    default: "customer",
  },
  wage: { type: Number },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
