const mongoose = require("mongoose");

const tourPromotionSchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    promotionType: {
      type: String,
      required: true,
      enum: ["percent", "fixed"], // 'percent' cho khuyến mãi theo phần trăm, 'fixed' cho khuyến mãi theo số tiền cố định.
    },
    descriptionPromotion: {
      type: String,
    },
    pricePromotion: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    conditions: {
      type: String, // Các điều kiện áp dụng cho khuyến mãi, ví dụ như "Áp dụng cho khách hàng mới", "Áp dụng khi đặt tour cho 4 người trở lên", v.v.
    },
  },
  {
    timestamps: true,
  }
);

const TourPromotion = mongoose.model("TourPromotion", tourPromotionSchema);

module.exports = TourPromotion;
