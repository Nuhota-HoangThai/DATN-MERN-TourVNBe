const express = require("express");
const router = express.Router();
const StatisticalController = require("../controllers/StatisticalController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

// Route thống kê tổng số tour
router.get(
  "/total-tours",
  verifyTokenCus(["admin"]),
  StatisticalController.totalTours
);

// Route thống kê số lượng tour đã bán được
router.get(
  "/tours-sold",
  verifyTokenCus(["admin"]),
  StatisticalController.toursSold
);

// Route thống kê tổng số reviews
router.get(
  "/total-reviews",
  verifyTokenCus(["admin"]),
  StatisticalController.totalReviews
);

// Ví dụ: /new-customers?startDate=2023-01-01&endDate=2023-01-31
router.get(
  "/new-customers",
  verifyTokenCus(["admin"]),
  StatisticalController.newCustomers
);

// Route for daily revenue
router.get(
  "/daily-revenue",
  verifyTokenCus(["admin"]),
  StatisticalController.revenueByDay
);

// Example: /monthly-revenue?year=2023&month=01
router.get(
  "/monthly-revenue",
  verifyTokenCus(["admin"]),
  StatisticalController.revenueByMonth
);

// Example: /yearly-revenue?year=2023
router.get(
  "/yearly-revenue",
  verifyTokenCus(["admin"]),
  StatisticalController.revenueByYear
);

router.get(
  "/booking-stats",
  verifyTokenCus(["admin"]),
  StatisticalController.bookingStatusStatistics
);

module.exports = router;
