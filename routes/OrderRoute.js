const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController"); // Đảm bảo đường dẫn đến OrderController đúng

router.post("/createOrders", OrderController.createOrder);

router.get("/listOrders", OrderController.listOrders);
router.patch("/:id/confirmStatus", OrderController.confirmOrderStatus);
router.get("/user/:id", OrderController.listOrdersByUser);
router.patch("/:id/cancel", OrderController.cancelOrder);
router.delete("/removeOrder/:id", OrderController.removeOrder);

module.exports = router;
