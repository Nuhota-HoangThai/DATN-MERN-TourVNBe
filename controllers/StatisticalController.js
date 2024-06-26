const mongoose = require("mongoose");
const Tour = require("../models/Tour"); // Đường dẫn thực tế có thể khác
const Booking = require("../models/Booking");
const ReviewTour = require("../models/Review");
const User = require("../models/User");

// Thống kê tổng số tour
exports.totalTours = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await Tour.countDocuments({
      ...(startDate && { createdAt: { $gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { $lte: new Date(endDate) } }),
    });
    res.json({ totalTours: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Số lượng tour đã bán được (Dựa vào số lượng booking không bị hủy)
exports.toursSold = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sold = await Booking.countDocuments({
      // status: { $ne: "cancelled" },
      ...(startDate && { bookingDate: { $gte: new Date(startDate) } }),
      ...(endDate && { bookingDate: { $lte: new Date(endDate) } }),
    });
    res.json({ toursSold: sold });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tổng số reviews
exports.totalReviews = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await ReviewTour.countDocuments({
      ...(startDate && { createdAt: { $gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { $lte: new Date(endDate) } }),
    });
    res.json({ totalReviews: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tổng số khách hàng mới (Dựa vào ngày tạo tài khoản)
// Có thể thống kê theo ngày, tháng, năm bằng cách truyền tham số và sử dụng query phù hợp
exports.newCustomers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const total = await User.countDocuments({
      ...(startDate && { date: { $gte: new Date(startDate) } }),
      ...(endDate && { date: { $lte: new Date(endDate) } }),
    });
    res.json({ newCustomers: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// thống kê doanh thu theo ngày
exports.revenueByDay = async (req, res) => {
  try {
    const revenueByDay = await Booking.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: {
                date: "$bookingDate",
                timezone: "Asia/Ho_Chi_Minh",
              },
            },
            month: {
              $month: {
                date: "$bookingDate",
                timezone: "Asia/Ho_Chi_Minh",
              },
            },
            year: {
              $year: {
                date: "$bookingDate",
                timezone: "Asia/Ho_Chi_Minh",
              },
            },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json(revenueByDay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// thống kê doanh thu theo tháng
exports.revenueByMonth = async (req, res) => {
  try {
    const revenueByMonth = await Booking.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$bookingDate" },
            year: { $year: "$bookingDate" },
          },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sắp xếp theo năm và tháng tăng dần
    ]);

    res.json(revenueByMonth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thống kê doanh thu theo năm
exports.revenueByYear = async (req, res) => {
  try {
    const revenueByYear = await Booking.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: { $year: "$bookingDate" },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(revenueByYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookingStatusStatistics = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$status", // Nhóm theo trạng thái booking
          count: { $sum: 1 }, // Đếm số lượng cho mỗi nhóm
        },
      },
    ]);

    // Chuyển đổi kết quả thành một đối tượng có các trường dễ đọc hơn
    const formattedStats = stats.reduce((acc, curr) => {
      const status = curr._id; // Trạng thái hiện tại đang xét
      acc[status] = curr.count; // Số lượng của trạng thái đó
      return acc;
    }, {});

    res.json({
      message: "Booking status statistics",
      data: formattedStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
