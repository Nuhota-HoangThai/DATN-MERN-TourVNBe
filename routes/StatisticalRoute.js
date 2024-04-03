const express = require("express");
const router = express.Router();
const StatisticalController = require("../controllers/StatisticalController");

const { verifyTokenCus } = require("../middleware/verifyTokenCus");

// Route thống kê tổng số tour
router.get(
  "/total-tours",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.totalTours
);

// Route thống kê số lượng tour đã bán được
router.get(
  "/tours-sold",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.toursSold
);

// Route thống kê tổng số reviews
router.get(
  "/total-reviews",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.totalReviews
);

// Ví dụ: /new-customers?startDate=2023-01-01&endDate=2023-01-31
router.get(
  "/new-customers",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.newCustomers
);

// Route for daily revenue
router.get(
  "/daily-revenue",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.revenueByDay
);

// Example: /monthly-revenue?year=2023&month=01
router.get(
  "/monthly-revenue",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.revenueByMonth
);

// Example: /yearly-revenue?year=2023
router.get(
  "/yearly-revenue",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.revenueByYear
);

router.get(
  "/booking-stats",
  verifyTokenCus(["admin", "staff"]),
  StatisticalController.bookingStatusStatistics
);

module.exports = router;
