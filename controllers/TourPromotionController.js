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

// Lấy danh sách tất cả khuyến mãi
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({});
    res.status(200).send(promotions);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lấy thông tin một khuyến mãi theo ID
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).send();
    }
    res.status(200).send(promotion);
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
