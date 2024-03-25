const express = require("express");
const router = express.Router();
const TourPromotionController = require("../controllers/TourPromotionController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

// Route để tạo mới một khuyến mãi
router.post("/promotions", TourPromotionController.createPromotion);

// Route để lấy thông tin chi tiết một khuyến mãi dựa trên ID
router.get("/promotions/:id", TourPromotionController.getPromotionById);

// Route để cập nhật thông tin một khuyến mãi
router.put("/promotions/:id", TourPromotionController.updatePromotion);

// Route để xóa một khuyến mãi
router.delete("/promotions/:id", TourPromotionController.deletePromotion);

// Route để lấy danh sách tất cả khuyến mãi
router.get("/promotions", TourPromotionController.getAllPromotions);

module.exports = router;
