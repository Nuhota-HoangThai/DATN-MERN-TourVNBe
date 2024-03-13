const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tour",
  },
  numberOfChildren: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfAdults: {
    type: Number,
    required: true,
    default: 0,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  additionalInformation: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
