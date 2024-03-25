const TourPromotion = require("../models/TourPromotion");

const TourPromotionController = {
  // Tạo mới một khuyến mãi
  createPromotion: async (req, res) => {
    try {
      const newPromotion = new TourPromotion(req.body);
      await newPromotion.save();
      res.status(201).send(newPromotion);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  // Lấy thông tin chi tiết một khuyến mãi dựa trên ID
  getPromotionById: async (req, res) => {
    try {
      const promotion = await TourPromotion.findById(req.params.id);
      if (!promotion) {
        return res.status(404).send({ message: "Promotion not found" });
      }
      res.send(promotion);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Cập nhật thông tin khuyến mãi
  updatePromotion: async (req, res) => {
    try {
      const promotion = await TourPromotion.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!promotion) {
        return res.status(404).send({ message: "Promotion not found" });
      }
      res.send(promotion);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  // Xóa khuyến mãi
  deletePromotion: async (req, res) => {
    try {
      const promotion = await TourPromotion.findByIdAndDelete(req.params.id);
      if (!promotion) {
        return res.status(404).send({ message: "Promotion not found" });
      }
      res.send({ message: "Promotion deleted successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Lấy danh sách tất cả khuyến mãi
  getAllPromotions: async (req, res) => {
    try {
      const promotions = await TourPromotion.find({});
      res.send(promotions);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = TourPromotionController;
