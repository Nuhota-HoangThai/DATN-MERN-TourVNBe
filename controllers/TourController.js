const Tour = require("../models/Tour");

// Add a new tour
exports.addTour = async (req, res) => {
  try {
    const images = req.files.map((file) => file.path);
    const tour = new Tour({
      nameTour: req.body.nameTour,
      image: images,
      regions: req.body.regions,
      price: req.body.price,
      description: req.body.description,
      maxParticipants: req.body.maxParticipants,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      tourType: req.body.tourType,
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
    const { id } = req.params;

    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

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
    tourType: req.body.tourType,
  };

  // If there is an image file to be uploaded, update the image field
  if (req.files && req.files.length > 0) {
    // Array to contain the paths of all uploaded images
    const imagesPaths = req.files.map((file) => file.path);

    // Update the image field in the update object
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
  try {
    let tours = await Tour.find({}).populate("tourType", "typeName");
    res.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({
      message: "Error fetching the tours",
      error: error.message,
    });
  }
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
  let popular_in_central = tours.slice(0, 6);
  res.send(popular_in_central);
};

//Get popular tours in the North
exports.getPopularInNorth = async (req, res) => {
  let tours = await Tour.find({ regions: "mb" });
  let popular_in_north = tours.slice(0, 6);
  res.send(popular_in_north);
};

//Get popular tours in the Southern
exports.getPopularInSouthern = async (req, res) => {
  let tours = await Tour.find({ regions: "mn" });
  let popular_in_southern = tours.slice(0, 6);
  res.send(popular_in_southern);
};

exports.getTourById = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!tourId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing tour ID" });
    }

    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

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

// Lấy tất cả các tour có cùng loại tour
exports.getToursByTourTypeId = async (req, res) => {
  try {
    const { tourTypeId } = req.params;

    const tours = await Tour.find({ tourType: tourTypeId });

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tours found for the specified tour type",
      });
    }

    res.json({
      success: true,
      tours: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving tours by tour type",
      error: error.message,
    });
  }
};

module.exports = exports;
