// PromotionController.js
const Promotion = require("../models/TourPromotion");

// Thêm một khuyến mãi mới
exports.createPromotion = async (req, res) => {
  try {
    const newPromotion = new Promotion(req.body);
    await newPromotion.save();
    res.status(201).send(newPromotion);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Lấy thông tin một khuyến mãi theo ID
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).send();
    }

    // Kiểm tra xem ngày hiện tại có nằm trong khoảng khuyến mãi không
    const now = new Date();
    if (
      now < promotion.startDatePromotion ||
      now > promotion.endDatePromotion
    ) {
      promotion.descriptionPromotion = "Khuyến mãi này hiện không áp dụng.";
    }

    res.status(200).send(promotion);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lấy danh sách tất cả khuyến mãi
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({});

    // Duyệt qua từng khuyến mãi để kiểm tra thời hạn áp dụng
    const updatedPromotions = promotions.map((promotion) => {
      const now = new Date();
      if (
        now < promotion.startDatePromotion ||
        now > promotion.endDatePromotion
      ) {
        promotion.descriptionPromotion = "Khuyến mãi này hiện không áp dụng.";
      }
      return promotion;
    });

    res.status(200).send(updatedPromotions);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Cập nhật khuyến mãi theo ID
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!promotion) {
      return res.status(404).send();
    }
    res.send(promotion);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Xóa khuyến mãi theo ID
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).send();
    }
    res.send(promotion);
  } catch (error) {
    res.status(500).send(error);
  }
};
