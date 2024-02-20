const Tour = require("../models/Tour");

// Cấu hình multer

// Add a new tour
exports.addTour = async (req, res) => {
  let tours = await Tour.find({});
  let id;
  if (tours.length > 0) {
    let last_tour_array = tours.slice(-1);
    let last_tour = last_tour_array[0];
    id = last_tour.id + 1;
  } else {
    id = 1;
  }
  const tour = new Tour({
    id: id,
    name: req.body.name,
    image: req.body.image,
    regions: req.body.regions,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    // distance: req.body.distance,
    desc: req.body.desc,
    maxGroupSize: req.body.maxGroupSize,
    date: req.body.date,
  });
  await tour.save();
  res.json({
    success: true,
    name: req.body.name,
  });
};

// Remove a tour

// Remove a tour
exports.removeTour = async (req, res) => {
  try {
    // Lấy _id từ params thay vì id
    const { id } = req.params;

    // Tìm và xóa tour dựa trên _id
    const deletedTour = await Tour.findByIdAndDelete(id);

    // Kiểm tra xem tour có tồn tại để xóa không
    if (!deletedTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Nếu tìm thấy và xóa thành công, trả về response
    res.json({
      success: true,
      message: "Tour successfully deleted",
      deletedTour: deletedTour,
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting the tour",
      error: error.message,
    });
  }
};

// Update a tour
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  const { image, name, maxGroupSize, old_price, new_price, regions, desc } =
    req.body; // Lấy dữ liệu cần cập nhật từ body của request

  try {
    // Cập nhật tour dựa trên ID và trả về thông tin sau khi cập nhật
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        image,
        name,
        maxGroupSize,
        old_price,
        new_price,
        regions,
        desc,
      },
      { new: true, runValidators: true }
    );

    // Kiểm tra xem có tìm thấy tour cần cập nhật hay không
    if (!updatedTour) {
      return res
        .status(404)
        .send({ success: false, message: "Tour not found" });
    }

    // Trả về response thành công cùng với dữ liệu của tour sau khi cập nhật
    res.send({
      success: true,
      message: "Tour updated successfully",
      tour: updatedTour,
    });
  } catch (err) {
    console.error("Error updating tour:", err);
    res
      .status(500)
      .json({ success: false, message: "Error updating the tour" });
  }
};

// Search a tour

// Get all tours
exports.getAllTours = async (req, res) => {
  let tours = await Tour.find({});
  res.send(tours);
};

// Get new collection tours
exports.getNewCollection = async (req, res) => {
  let tours = await Tour.find({});
  let newCollection = tours.slice(1).slice(-8);
  res.send(newCollection);
};

// Get popular tours in the central region
exports.getPopularInCentral = async (req, res) => {
  let tours = await Tour.find({ regions: "mt" });
  let popular_in_central = tours.slice(0, 4);
  res.send(popular_in_central);
};

module.exports = exports;
