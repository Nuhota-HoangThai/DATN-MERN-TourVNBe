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
      message: "Tour type created successfully",
      tourType: tourType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating tour type",
      error: error.message,
    });
  }
};

// Cập nhật thông tin của một loại tour
exports.updateTourType = async (req, res) => {
  const { id } = req.params;
  const { typeName, description } = req.body;

  try {
    const updatedTourType = await TourType.findByIdAndUpdate(
      id,
      { typeName, description },
      { new: true, runValidators: true }
    );

    if (!updatedTourType) {
      return res.status(404).json({
        success: false,
        message: "Tour type not found",
      });
    }

    res.json({
      success: true,
      message: "Tour type updated successfully",
      tourType: updatedTourType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating tour type",
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
        message: "Tour type not found",
      });
    }

    res.json({
      success: true,
      message: "Tour type deleted successfully",
      tourType: deletedTourType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting tour type",
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
