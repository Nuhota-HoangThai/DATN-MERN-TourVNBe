const Review = require("../models/Review");
const Tour = require("../models/Tour");
const User = require("../models/User"); // Ensure you have the User model

exports.createReview = async (req, res) => {
  const { tourId } = req.params;
  const userId = req.user.id; // Giả định req.user.id lưu trữ ID của người dùng đã đăng nhập

  // Kiểm tra xem tourId và userId có tồn tại trong DB không
  try {
    const tourExists = await Tour.findById(tourId);
    const userExists = await User.findById(userId);

    if (!tourExists || !userExists) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy chuyến tham quan hoặc người dùng",
      });
    }

    // Xử lý file uploads từ req.files (do multer cung cấp)
    const images = req.files["image"]
      ? req.files["image"].map((file) => file.path)
      : [];
    const videos = req.files["video"]
      ? req.files["video"].map((file) => file.path)
      : [];

    // Tạo document review mới với thông tin từ request và file paths
    const reviewData = {
      ...req.body, // Lấy dữ liệu review từ body
      tourId,
      userId,
      image: images,
      video: videos,
    };

    const savedReview = await new Review(reviewData).save();
    // Cập nhật thông tin review vào trong collection Tour nếu cần
    await Tour.findByIdAndUpdate(tourId, {
      $push: { reviews: savedReview._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Đã gửi đánh giá", data: savedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

exports.getReviews = async (req, res) => {
  const { tourId } = req.params;

  try {
    const tourWithReviews = await Tour.findById(tourId).populate({
      path: "reviews",
      model: "ReviewTour",
      populate: {
        path: "userId",
        model: "User",
      },
    });

    if (!tourWithReviews) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy tour" });
    }

    res.status(200).json({ success: true, reviews: tourWithReviews.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err });
  }
};

// Lấy các tour có review cùng với chi tiết của từng review và thông tin người dùng
exports.getToursWithReviews = async (req, res) => {
  try {
    const tours = await Tour.find({ "reviews.0": { $exists: true } })
      .populate({
        path: "reviews",
        populate: {
          path: "userId",
          model: "User",
          select: "name", // Chỉ lấy tên người dùng
        },
      })
      .select("nameTour");

    if (!tours.length) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy chuyến tham quan nào có đánh giá",
      });
    }

    res.status(200).json({ success: true, tours });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm nạp các tour có bài đánh giá" });
  }
};

// delete review của cá nhân đã tạo ra review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // Người dùng cần đăng nhập để xóa review

  try {
    // Tìm và xác nhận review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(400)
        .json({ success: false, error: "Không tìm thấy đánh giá." });
    }
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Không được phép xóa đánh giá này",
      });
    }

    // Xóa review
    await Review.findByIdAndDelete(reviewId);

    // Cập nhật danh sách review trong tour tương ứng
    await Tour.findByIdAndUpdate(review.tourId, {
      $pull: { reviews: reviewId },
    });

    res
      .status(200)
      .json({ success: true, message: "Xóa đánh giá thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.toString() });
  }
};

// xóa review dành cho admin
exports.deleteReviewAdmin = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy đánh giá" });
    }

    await Review.findByIdAndDelete(reviewId); // Changed from findByIdAndRemove

    await Tour.findByIdAndUpdate(review.tourId, {
      $pull: { reviews: reviewId },
    });

    res.status(200).json({ success: true, message: "Xóa đánh giá thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.toString() });
  }
};

// Xem chi tiết review
exports.getReviewDetail = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId)
      .populate("tourId", "nameTour description")
      .populate("userId", "name email")
      .populate("bookingId", "bookingDate status");
    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy đánh giá",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error: " + err.message,
    });
  }
};

// review của cá nhân (lấy hết review)
exports.getUserReviews = async (req, res) => {
  try {
    // Lấy ID người dùng từ thông tin đã xác thực
    const userId = req.user.id;

    // Tìm tất cả các đánh giá của người dùng này
    const reviews = await Review.find({ userId: userId }).populate(
      "tourId",
      "nameTour"
    );

    // Trả về kết quả
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy đánh giá nào cho người dùng này",
      });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

exports.getHighRatedReviews = async (req, res) => {
  try {
    // Truy vấn tìm tất cả review có rating lớn hơn 5
    const highRatedReviews = await Review.find({ rating: { $gt: 5 } })
      .populate("tourId", "nameTour")
      .populate("userId", "name image");

    if (!highRatedReviews.length) {
      return res.status(404).json({
        error: "Không tìm thấy đánh giá được xếp hạng cao",
      });
    }

    res.status(200).json({ success: true, data: highRatedReviews });
  } catch (error) {
    console.error("Lỗi khi tìm các đánh giá được xếp hạng cao:", error);
    res.status(500).json({ success: false, error: error.toString() });
  }
};

module.exports = exports;
