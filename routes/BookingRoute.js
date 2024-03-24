const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/createBooking", verifyToken, BookingController.createBooking);

router.get("/listBookings", BookingController.listBookings);
router.patch("/:id/confirmStatus", BookingController.confirmBookingStatus);
router.get("/user", verifyToken, BookingController.listBookingsByUser);
router.patch("/:id/cancel", BookingController.cancelBooking);
router.delete("/removeBooking/:id", BookingController.removeBooking);
router.get("/bookings/:id", BookingController.getBookingDetails);

module.exports = router;
