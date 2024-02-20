const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController"); // Đảm bảo đường dẫn đến OrderController đúng

router.post("/createOrders", OrderController.createOrder);

router.put("/orders/:id", OrderController.updateOrder);
router.delete("/orders/:id", OrderController.deleteOrder);

router.get("/listOrders", OrderController.listOrders);
router.patch("/:id/confirmStatus", OrderController.confirmOrderStatus);
router.get("/user/:id", OrderController.listOrdersByUser);

module.exports = router;
