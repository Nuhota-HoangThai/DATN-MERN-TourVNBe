const TourDirectory = require("../models/TourDirectory");

// Tạo một danh mục tour mới
exports.createTourDirectory = async (req, res) => {
  try {
    if (req.file) {
      const imagePath = req.file.path; // Lấy đường dẫn hình ảnh

      // Tạo một đối tượng mới với dữ liệu từ req.body và thêm đường dẫn hình ảnh
      const newTourDirectory = {
        ...req.body,
        image: imagePath, // Thêm đường dẫn hình ảnh vào dữ liệu khuyến mãi
      };

      const tourDirectory = new TourDirectory(newTourDirectory);
      await tourDirectory.save();
      res.json({
        success: true,
        message: "Đã tạo thành công danh mục chuyến tham quan",
        tourDirectory,
      });
    } else {
      res.status(400).json({ error: "Cần ít nhất một hình ảnh" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tạo danh mục chuyến tham quan không thành công",
      error: error.message,
    });
  }
};

// Cập nhật thông tin của một danh mục tour
exports.updateTourDirectory = async (req, res) => {
  const { id } = req.params;
  const { directoryName, directoryDescription } = req.body;

  try {
    const updatedTourDirectory = await TourDirectory.findByIdAndUpdate(
      id,
      { directoryName, directoryDescription },
      { new: true, runValidators: true }
    );

    if (!updatedTourDirectory) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy danh mục tour.",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật danh mục tour thành công.",
      tourDirectory: updatedTourDirectory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật danh mục tour",
      error: error.message,
    });
  }
};

// Xóa một danh mục tour
exports.deleteTourDirectory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTourDirectory = await TourDirectory.findByIdAndDelete(id);

    if (!deletedTourDirectory) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy danh mục tour.",
      });
    }

    res.json({
      success: true,
      message: "Xóa danh mục tour thành công",
      tourDirectory: deletedTourDirectory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi xóa danh mục tour",
      error: error.message,
    });
  }
};

// Lấy tất cả các danh mục tour
exports.getAllTourDirectories = async (req, res) => {
  try {
    const tourDirectories = await TourDirectory.find({});

    res.json({
      success: true,
      tourDirectories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi truy xuất danh mục tour",
      error: error.message,
    });
  }
};

exports.getAllTourDirectoriesLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 5; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalToursDirec = await TourDirectory.countDocuments();
    const totalPages = Math.ceil(totalToursDirec / limit);

    const tourDirectories = await TourDirectory.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tourDirectories,
      page,
      limit,
      totalPages,
      totalToursDirec,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi truy xuất danh mục tour",
      error: error.message,
    });
  }
};

// Lấy danh mục tour theo id
exports.getTourDirectoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const tourDirectory = await TourDirectory.findById(id);
    if (!tourDirectory) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy danh mục tour." });
    }
    res.json({ success: true, tourDirectory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi truy xuất danh mục tour",
      error: error.message,
    });
  }
};

module.exports = exports;
