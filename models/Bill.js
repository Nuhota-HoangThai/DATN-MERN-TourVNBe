const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Booking",
  },
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
  totalCost: {
    type: Number,
    required: true,
  },

  //ngay xuat hoa don
  issuedDate: {
    type: Date,
    default: Date.now,
  },

  numberOfChildrenBill: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfAdultsBill: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfYoungChildrenBill: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfInfantsBill: {
    type: Number,
    required: true,
    default: 0,
  },
  bookingDateBill: {
    type: Date,
    default: Date.now,
  },
  statusBill: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatusBill: {
    type: String,
    required: true,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
  paymentMethodBill: {
    type: String,
    required: true,
    enum: ["VNPay", "COD", "Unpaid"],
    default: "Unpaid",
  },

  // Prices
  adultPriceBill: {
    type: Number,
  },

  // Assuming this is for children aged 6-16
  childPriceBill: {
    type: Number,
  },

  // 3-6 ages
  youngChildrenPriceBill: {
    type: Number,
  },

  // For children under 3 years
  infantPriceBill: {
    type: Number,
  },
  surchargeBill: {
    // Additional charge
    type: Number,
  },
  notesBill: {
    type: String,
  },
});

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
