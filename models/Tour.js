const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    tourType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourType",
      required: false,
    },

    tourDirectory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourDirectory",
      required: false,
    },

    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
      required: false,
    },

    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReviewTour",
      required: false,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReviewTour" }],

    userGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transport: { type: String },
    nameTour: { type: String, required: true },
    image: [{ type: String, required: true }],
    video: [{ type: String }],
    regions: { type: String, required: true },
    price: { type: Number, required: true },
    // Giá cho trẻ em từ 6 đến 16 tuổi
    priceForChildren: {
      type: Number,
    },

    // Giá cho trẻ em từ dưới 6 tuổi
    priceForYoungChildren: {
      type: Number,
      required: false,
    },

    // Phụ thu khác
    additionalFees: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    timeTravel: { type: String },
    convergeTime: { type: Date },
    startingGate: { type: String },
    //Lịch trình
    schedule: { type: String },
    description: {
      type: String,
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    // lưu gia goc truoc khi thanh gia khuyen mai
    originalPrice: { type: Number },
    originalPriceForChildren: { type: Number },
    originalPriceForYoungChildren: { type: Number },

    //trường này để kiểm tra khuyến mãi
    isPriceDiscounted: {
      type: Boolean,
      required: true,
      default: false, // Mặc định giá trị là false nếu không được cung cấp
    },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
