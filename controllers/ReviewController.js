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
      return res
        .status(404)
        .json({ success: false, message: "Tour or User not found" });
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
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

// exports.createReview = async (req, res) => {
//   const { tourId } = req.params;
//   const userId = req.user.id; // Giả định req.user.id lưu trữ ID của người dùng đã đăng nhập

//   try {
//     const tourExists = await Tour.findById(tourId);
//     const userExists = await User.findById(userId);

//     if (!tourExists || !userExists) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Tour or User not found" });
//     }

//     // Kiểm tra xem người dùng đã đánh giá tour này chưa
//     const existingReview = await Review.findOne({ tourId, userId });
//     if (existingReview) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "You have already reviewed this tour",
//         });
//     }

//     // Xử lý file uploads từ req.files (do multer cung cấp)
//     const images = req.files["image"]
//       ? req.files["image"].map((file) => file.path)
//       : [];
//     const videos = req.files["video"]
//       ? req.files["video"].map((file) => file.path)
//       : [];

//     // Tạo document review mới với thông tin từ request và file paths
//     const reviewData = {
//       ...req.body, // Lấy dữ liệu review từ body
//       tourId,
//       userId,
//       image: images,
//       video: videos,
//     };

//     const savedReview = await new Review(reviewData).save();
//     // Cập nhật thông tin review vào trong collection Tour nếu cần
//     await Tour.findByIdAndUpdate(tourId, {
//       $push: { reviews: savedReview._id },
//     });

//     res
//       .status(200)
//       .json({ success: true, message: "Review submitted", data: savedReview });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: err.toString() });
//   }
// };

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
        .json({ success: false, message: "Tour not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "No tours with reviews found" });
    }

    res.status(200).json({ success: true, tours });
  } catch (error) {
    console.error("Error fetching tours with reviews:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// // update review của cá nhân đã tạo ra review
// exports.updateReview = async (req, res) => {
//   const { reviewId } = req.params;
//   const userId = req.user.id; // Người dùng đăng nhập để cập nhật review

//   try {
//     // Tìm review cần cập nhật và  người dùng hiện tại là người đã tạo review
//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Review not found" });
//     }
//     if (review.userId.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized to update this review",
//       });
//     }

//     // Cập nhật review với dữ liệu mới
//     const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
//       new: true,
//     });
//     res
//       .status(200)
//       .json({ success: true, message: "Review updated", data: updatedReview });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.toString() });
//   }
// };

// delete review của cá nhân đã tạo ra review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // Người dùng cần đăng nhập để xóa review

  try {
    // Tìm và xác nhận review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review",
      });
    }

    // Xóa review
    await Review.findByIdAndDelete(reviewId);

    // Cập nhật danh sách review trong tour tương ứng
    await Tour.findByIdAndUpdate(review.tourId, {
      $pull: { reviews: reviewId },
    });

    res.status(200).json({ success: true, message: "Review deleted" });
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
        .json({ success: false, message: "Review not found" });
    }

    await Review.findByIdAndDelete(reviewId); // Changed from findByIdAndRemove

    await Tour.findByIdAndUpdate(review.tourId, {
      $pull: { reviews: reviewId },
    });

    res.status(200).json({ success: true, message: "Review deleted" });
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
        message: "Review not found",
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
      return res
        .status(404)
        .json({ success: false, message: "No reviews found for this user" });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.toString() });
  }
};

module.exports = exports;
