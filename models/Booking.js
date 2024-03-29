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
    enum: ["VNPay", "COD", "Unpaid"], // Thêm phương thức thanh toán VNPay và COD
    default: "Unpaid",
  },
  ///////
  // Prices
  adultPrice: {
    type: Number,
    //required: true,
  },
  childPrice: {
    // Assuming this is for children aged 6-16
    type: Number,
    //required: true,
  },

  // 3-6 ages
  youngChildrenPrice: {
    type: Number,
  },

  infantPrice: {
    // For children under 3 years
    type: Number,
    //required: true,
  },
  surcharge: {
    // Additional charge
    type: Number,
    // Assuming the surcharge might not apply in all cases
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
