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

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewTour",
    },
  ],

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
  numberOfYoungChildren: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfInfants: {
    type: Number,
    required: true,
    default: 0,
  },

  singleRoomNumber: {
    type: Number,
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
  paymentMethod: {
    type: String,
    required: true,
    enum: ["VNPay", "Unpaid"],
    default: "Unpaid",
  },

  // Prices
  adultPrice: {
    type: Number,
  },

  // Assuming this is for children aged 6-16
  childPrice: {
    type: Number,
  },

  // 3-6 ages
  youngChildrenPrice: {
    type: Number,
  },

  // For children under 3 years
  infantPrice: {
    type: Number,
  },
  surcharge: {
    // Additional charge
    type: Number,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  additionalInformation: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
