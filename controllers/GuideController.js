const TourGuide = require("../models/Guide"); // Đảm bảo đường dẫn đúng với cấu trúc thư mục của bạn

const GuideController = {
  // Tạo một hướng dẫn viên mới
  //   createGuide: async (req, res) => {
  //     try {
  //       const newGuide = new TourGuide(req.body);
  //       await newGuide.save();
  //       res.status(201).json(newGuide);
  //     } catch (error) {
  //       res.status(400).json({ message: error.message });
  //     }
  //   },

  // Lấy danh sách tất cả hướng dẫn viên
  getAllGuides: async (req, res) => {
    try {
      const guides = await TourGuide.find().populate("guide");
      res.status(200).json(guides);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy thông tin một hướng dẫn viên theo ID
  getGuideById: async (req, res) => {
    try {
      const guide = await TourGuide.findById(req.params.id).populate("guide");
      if (guide) {
        res.status(200).json(guide);
      } else {
        res.status(404).json({ message: "Guide not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật thông tin hướng dẫn viên
  updateGuide: async (req, res) => {
    try {
      const guide = await TourGuide.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (guide) {
        res.status(200).json(guide);
      } else {
        res.status(404).json({ message: "Guide not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Xóa hướng dẫn viên
  //   deleteGuide: async (req, res) => {
  //     try {
  //       const guide = await TourGuide.findByIdAndDelete(req.params.id);
  //       if (guide) {
  //         res.status(200).json({ message: "Guide deleted successfully" });
  //       } else {
  //         res.status(404).json({ message: "Guide not found" });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ message: error.message });
  //     }
  //   },
};

module.exports = GuideController;
