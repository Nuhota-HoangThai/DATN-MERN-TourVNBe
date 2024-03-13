const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController"); // Đảm bảo đường dẫn đến OrderController đúng

router.post("/createBooking", BookingController.createBooking);

router.get("/listBookings", BookingController.listBookings);
router.patch("/:id/confirmStatus", BookingController.confirmBookingStatus);
router.get("/user/:id", BookingController.listBookingsByUser);
router.patch("/:id/cancel", BookingController.cancelBooking);
router.delete("/removeBooking/:id", BookingController.removeBooking);

module.exports = router;
