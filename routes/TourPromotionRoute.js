const express = require("express");
const router = express.Router();

const promotionController = require("../controllers/TourPromotionController");
const { verifyTokenCus } = require("../middleware/verifyTokenCus");

const { upload } = require("../config/uploadImage");

// Cấu hình các route
router.post(
  "/createPromotion",
  upload.single("image"),
  verifyTokenCus(["admin"]),
  promotionController.createPromotion
);
router.get("/getAllPromotion", promotionController.getAllPromotions);

router.get(
  "/getAllPromotionLimit",
  verifyTokenCus(["admin"]),
  promotionController.getAllPromotionsLimit
);

router.get(
  "/getPromotionById/:id",
  verifyTokenCus(["admin"]),
  promotionController.getPromotionById
);
router.put(
  "/updatePromotion/:id",
  verifyTokenCus(["admin"]),
  promotionController.updatePromotion
);
router.delete(
  "/deletePromotion/:id",
  verifyTokenCus(["admin"]),
  promotionController.deletePromotion
);

module.exports = router;
