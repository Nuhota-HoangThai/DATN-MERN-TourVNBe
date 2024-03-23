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
  numberOfInfants: {
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

  ///////
  // Prices
  adultPrice: {
    type: Number,
    //required: true,
  },
  childPrice: {
    // Assuming this is for children aged 2-12
    type: Number,
    //required: true,
  },
  infantPrice: {
    // For children under 2 years
    type: Number,
    //required: true,
  },
  surcharge: {
    // Additional charge
    type: Number,
    default: 0, // Assuming the surcharge might not apply in all cases
  },
  //////

  totalAmount: {
    type: Number,
    required: true,
  },

  additionalInformation: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
