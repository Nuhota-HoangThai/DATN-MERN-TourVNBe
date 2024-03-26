const express = require("express");
const router = express.Router();

const promotionController = require("../controllers/TourPromotionController");
const { verifyTokenCus } = require("../middleware/verifyTokenCus");

// Cấu hình các route
router.post(
  "/createPromotion",
  verifyTokenCus(["admin", "staff"]),
  promotionController.createPromotion
);
router.get(
  "/getAllPromotion",
  verifyTokenCus(["admin", "staff"]),
  promotionController.getAllPromotions
);
router.get(
  "/getPromotionById/:id",
  verifyTokenCus(["admin", "staff"]),
  promotionController.getPromotionById
);
router.put(
  "/updatePromotion/:id",
  verifyTokenCus(["admin", "staff"]),
  promotionController.updatePromotion
);
router.delete(
  "/deletePromotion/:id",
  verifyTokenCus(["admin", "staff"]),
  promotionController.deletePromotion
);

module.exports = router;
