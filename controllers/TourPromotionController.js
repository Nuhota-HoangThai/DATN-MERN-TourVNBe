const Promotion = require("../models/TourPromotion");

const cron = require("node-cron");
const moment = require("moment-timezone");

const timezone = "Asia/Ho_Chi_Minh";

cron.schedule(
  "0 0 * * *",
  async () => {
    // Mỗi ngày vào lúc 00:00, kiểm tra và cập nhật giá tour dựa trên khuyến mãi
    //console.log("Running a daily check for tour promotions");
    await updateTourPricesBasedOnPromotions();
  },
  {
    scheduled: true,
    timezone: timezone,
  }
);

// Thêm một khuyến mãi mới
exports.createPromotion = async (req, res) => {
  try {
    // Kiểm tra xem có file hình ảnh nào được tải lên hay không
    if (req.file) {
      const imagePath = req.file.path; // Lấy đường dẫn hình ảnh

      // Tạo một đối tượng mới với dữ liệu từ req.body và thêm đường dẫn hình ảnh
      const newPromotionData = {
        ...req.body,
        image: imagePath, // Thêm đường dẫn hình ảnh vào dữ liệu khuyến mãi
      };

      const newPromotion = new Promotion(newPromotionData);
      await newPromotion.save(); // Lưu đối tượng vào cơ sở dữ liệu

      res.status(201).send(newPromotion);
    } else {
      res.status(400).send("An image is required.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

// Lấy thông tin một khuyến mãi theo ID
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).send();
    }

    // Kiểm tra xem ngày hiện tại có nằm trong khoảng khuyến mãi không
    const now = new Date();
    if (
      now < promotion.startDatePromotion ||
      now > promotion.endDatePromotion
    ) {
      promotion.descriptionPromotion = "Khuyến mãi này hiện không áp dụng.";
    }

    res.status(200).send(promotion);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Lấy danh sách tất cả khuyến mãi
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({});

    // Duyệt qua từng khuyến mãi để kiểm tra thời hạn áp dụng
    const updatedPromotions = promotions.map((promotion) => {
      const now = new Date();
      if (
        now < promotion.startDatePromotion ||
        now > promotion.endDatePromotion
      ) {
        promotion.descriptionPromotion = "Khuyến mãi này hiện không áp dụng.";
      }
      return promotion;
    });

    res.status(200).send(updatedPromotions);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllPromotionsLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 6; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalToursPromotion = await Promotion.countDocuments();
    const totalPages = Math.ceil(totalToursPromotion / limit);

    const promotions = await Promotion.find({}).skip(skip).limit(limit);

    // Duyệt qua từng khuyến mãi để kiểm tra thời hạn áp dụng
    const updatedPromotions = promotions.map((promotion) => {
      const now = new Date();
      if (
        now < promotion.startDatePromotion ||
        now > promotion.endDatePromotion
      ) {
        promotion.descriptionPromotion = "Khuyến mãi này hiện không áp dụng.";
      }
      return promotion;
    });

    res.json({
      updatedPromotions,
      page,
      limit,
      totalPages,
      totalToursPromotion,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Cập nhật khuyến mãi theo ID
exports.updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!promotion) {
      return res.status(404).send();
    }
    res.send(promotion);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Xóa khuyến mãi theo ID
exports.deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).send();
    }
    res.send(promotion);
  } catch (error) {
    res.status(500).send(error);
  }
};
