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

module.exports = exports;
