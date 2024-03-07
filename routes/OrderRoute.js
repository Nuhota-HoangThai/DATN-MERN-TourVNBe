const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController"); // Đảm bảo đường dẫn đến OrderController đúng
const { checkRole } = require("../middleware/verifyToken");

router.post("/createOrders", OrderController.createOrder);

router.get("/listOrders", OrderController.listOrders);
router.patch("/:id/confirmStatus", OrderController.confirmOrderStatus);
router.get("/user/:id", OrderController.listOrdersByUser);
// Route để hủy đơn hàng
router.patch("/:id/cancel", OrderController.cancelOrder);

module.exports = router;
