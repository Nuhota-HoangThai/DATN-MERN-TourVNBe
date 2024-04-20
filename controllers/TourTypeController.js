const TourType = require("../models/TourType");

// Tạo một loại tour mới
exports.createTourType = async (req, res) => {
  try {
    const { typeName, description } = req.body;

    const tourType = new TourType({
      typeName,
      description,
    });

    await tourType.save();

    res.json({
      success: true,
      message: "Tạo loại tour thành công.",
      tourType: tourType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo loại chuyến tham quan",
      error: error.message,
    });
  }
};

// Cập nhật thông tin của một loại tour
exports.updateTourType = async (req, res) => {
  const { id } = req.params;
  const { typeName, description } = req.body;
  // console.table(req.body);
  try {
    const updatedTourType = await TourType.findByIdAndUpdate(
      id,
      { typeName, description },
      { new: true, runValidators: true }
    );

    if (!updatedTourType) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy loại tour",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật loại tour thành công",
      tourType: updatedTourType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật loại tour",
      error: error.message,
    });
  }
};

// Xóa một loại tour
exports.deleteTourType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTourType = await TourType.findByIdAndDelete(id);

    if (!deletedTourType) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy loại tour",
      });
    }

    res.json({
      success: true,
      message: "Xóa loại tour thành công",
      tourType: deletedTourType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi xóa loại tour",
      error: error.message,
    });
  }
};

// Lấy tất cả các loại tour
exports.getAllTourTypes = async (req, res) => {
  try {
    const tourTypes = await TourType.find({});

    res.json({
      success: true,
      tourTypes: tourTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi truy xuất các loại chuyến tham quan",
      error: error.message,
    });
  }
};

exports.getAllTourTypesLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 5; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalToursType = await TourType.countDocuments();
    const totalPages = Math.ceil(totalToursType / limit);

    const tourTypes = await TourType.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      tourTypes: tourTypes,
      page,
      limit,
      totalPages,
      totalToursType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tour types",
      error: error.message,
    });
  }
};

// Lấy tour types theo id
exports.getTourTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const tourType = await TourType.findById(id);
    if (!tourType) {
      return res
        .status(404)
        .json({ success: false, message: "Tour type not found" });
    }
    res.json({ success: true, tourType });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tour type",
      error: error.message,
    });
  }
};

module.exports = exports;
