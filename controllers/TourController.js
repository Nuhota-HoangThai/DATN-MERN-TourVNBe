const Tour = require("../models/Tour");

// Add a new tour
exports.addTour = async (req, res) => {
  try {
    let tours = await Tour.find({});
    let id;
    if (tours.length > 0) {
      let last_tour_array = tours.slice(-1);
      let last_tour = last_tour_array[0];
      id = last_tour.id + 1;
    } else {
      id = 1;
    }
    const images = req.files.map((file) => file.path);
    const tour = new Tour({
      id: id,
      nameTour: req.body.nameTour,
      image: images,
      regions: req.body.regions,
      price: req.body.price,
      description: req.body.description,
      maxParticipants: req.body.maxParticipants,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    await tour.save();
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

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

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  let update = {
    nameTour: req.body.nameTour,
    maxParticipants: req.body.maxParticipants,
    price: req.body.price,
    regions: req.body.regions,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  // Nếu có file ảnh được upload thì cập nhật image field
  if (req.files && req.files.length > 0) {
    // Mảng để chứa đường dẫn của tất cả hình ảnh được upload
    const imagesPaths = req.files.map((file) => file.path);

    // Cập nhật trường image trong đối tượng update
    update.image = imagesPaths;
  }

  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    res.json({
      success: true,
      message: "Tour updated successfully",
      tour: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating the tour",
      error: error.message,
    });
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
  let tours = await Tour.find({ regions: "miền Trung" });
  let popular_in_central = tours.slice(0, 6);
  res.send(popular_in_central);
};

// Lấy tour theo ID
exports.getTourById = async (req, res) => {
  try {
    // Lấy ID từ params
    const { id } = req.params;

    // Tìm tour bằng ID
    const tour = await Tour.findById(id);

    // Kiểm tra xem tour có tồn tại không
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Nếu tour tồn tại, trả về tour
    res.json({ success: true, tour: tour });
  } catch (error) {
    console.error("Error finding tour:", error);
    res.status(500).json({
      success: false,
      message: "Error finding the tour",
      error: error.message,
    });
  }
};

module.exports = exports;
