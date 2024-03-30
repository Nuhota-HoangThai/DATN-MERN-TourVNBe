const express = require("express");
const router = express.Router();
const StatisticalController = require("../controllers/StatisticalController");

// Route thống kê tổng số tour
router.get("/total-tours", StatisticalController.totalTours);

// Route thống kê số lượng tour đã bán được
router.get("/tours-sold", StatisticalController.toursSold);

// Route thống kê tổng số reviews
router.get("/total-reviews", StatisticalController.totalReviews);

// Ví dụ: /new-customers?startDate=2023-01-01&endDate=2023-01-31
router.get("/new-customers", StatisticalController.newCustomers);

// Route for daily revenue
router.get("/daily-revenue", StatisticalController.revenueByDay);

// Example: /monthly-revenue?year=2023&month=01
router.get("/monthly-revenue", StatisticalController.revenueByMonth);

// Example: /yearly-revenue?year=2023
router.get("/yearly-revenue", StatisticalController.revenueByYear);

module.exports = router;
