const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

const { verifyToken } = require("../middleware/verifyToken");
const { verifyTokenCus } = require("../middleware/verifyTokenCus");

router.post("/createBooking", verifyToken, BookingController.createBooking);

router.get(
  "/listBookings",
  verifyTokenCus(["admin", "staff"]),
  BookingController.listBookings
);

router.get(
  "/listBookingsLimit",
  verifyTokenCus(["admin", "staff"]),
  BookingController.listBookingsLimit
);

router.patch(
  "/:id/confirmStatus",
  verifyTokenCus(["admin", "staff"]),
  BookingController.confirmBookingStatus
);

router.get("/user", verifyToken, BookingController.listBookingsByUser);

router.patch("/:id/cancel", verifyToken, BookingController.cancelBooking);

router.delete(
  "/removeBooking/:id",
  verifyTokenCus(["admin", "staff"]),
  BookingController.removeBooking
);

router.get(
  "/bookings/:id",
  verifyTokenCus(["admin", "staff"]),
  BookingController.getBookingDetails
);

router.post(
  "/payment_vnpay_url",
  verifyToken,
  BookingController.addOrderByVNPay
);

module.exports = router;
