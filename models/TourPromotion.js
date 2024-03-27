const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  namePromotion: { type: String, required: true },
  discountPercentage: { type: Number, required: true },

  descriptionPromotion: { type: String },
  startDatePromotion: { type: Date, required: true },
  endDatePromotion: { type: Date, required: true },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
