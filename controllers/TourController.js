const Tour = require("../models/Tour");
const Promotion = require("../models/TourPromotion");

// Add a new tour
exports.addTour = async (req, res) => {
  try {
    const images = req.files.image
      ? req.files.image.map((file) => file.path)
      : [];
    const videos = req.files.video
      ? req.files.video.map((file) => file.path)
      : [];

    const tour = new Tour({
      image: images,
      video: videos,

      tourType: req.body.tourType,
      tourDirectory: req.body.tourDirectory,

      nameTour: req.body.nameTour,
      regions: req.body.regions,
      price: req.body.price,
      priceForChildren: req.body.priceForChildren,
      priceForYoungChildren: req.body.priceForYoungChildren,
      priceForInfants: req.body.priceForInfants,
      maxParticipants: req.body.maxParticipants,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startingGate: req.body.startingGate,
      convergeTime: req.body.convergeTime,
      description: req.body.description,
      additionalFees: req.body.additionalFees,
    });

    await tour.save();
    return res.status(200).json({
      success: true,
      nameTour: req.body.nameTour,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
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

//
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  let update = {
    tourType: req.body.tourType,
    tourDirectory: req.body.tourDirectory,
    nameTour: req.body.nameTour,
    maxParticipants: req.body.maxParticipants,
    regions: req.body.regions,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    convergeTime: req.body.convergeTime,
    startingGate: req.body.startingGate,
    price: req.body.price,
    priceForChildren: req.body.priceForChildren,
    priceForYoungChildren: req.body.priceForYoungChildren,
    priceForInfants: req.body.priceForInfants,
    additionalFees: req.body.additionalFees,
    promotion: req.body.promotion,
  };

  if (req.files && req.files.length > 0) {
    const imagesPaths = req.files.map((file) => file.path);
    update.image = imagesPaths;
  }

  try {
    // Check if a promotion is applied and fetch it
    if (update.promotion) {
      const promotion = await Promotion.findById(update.promotion);
      if (!promotion) {
        return res
          .status(404)
          .json({ success: false, message: "Promotion not found" });
      }

      const tourBeforeUpdate = await Tour.findById(id);

      // Lưu giá gốc nếu chưa có
      if (!tourBeforeUpdate.originalPrice) {
        update.originalPrice = tourBeforeUpdate.price;
        update.originalPriceForChildren = tourBeforeUpdate.priceForChildren;
        update.originalPriceForYoungChildren =
          tourBeforeUpdate.priceForYoungChildren;
        update.originalPriceForInfants = tourBeforeUpdate.priceForInfants;
      }

      const applyDiscount = (price, discountPercentage) => {
        const discount = (price * discountPercentage) / 100;
        return price - discount;
      };

      // Apply the discount to applicable price fields
      update.price = applyDiscount(update.price, promotion.discountPercentage);
      update.priceForChildren = applyDiscount(
        update.priceForChildren,
        promotion.discountPercentage
      );
      update.priceForYoungChildren = applyDiscount(
        update.priceForYoungChildren,
        promotion.discountPercentage
      );
      update.priceForInfants = applyDiscount(
        update.priceForInfants,
        promotion.discountPercentage
      );
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");

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

exports.getAllTours = async (req, res) => {
  try {
    let tours = await Tour.find({})
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");
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
  let tours = await Tour.find({})
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate("promotion", "namePromotion discountPercentage");
  let newCollection = tours.slice(1).slice(-8);
  res.send(newCollection);
};

// Get popular tours in the central region
exports.getPopularInCentral = async (req, res) => {
  let tours = await Tour.find({ regions: "mt" })
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate("promotion", "namePromotion discountPercentage");
  let popular_in_central = tours.slice(0, 6);
  res.send(popular_in_central);
};

//Get popular tours in the North
exports.getPopularInNorth = async (req, res) => {
  let tours = await Tour.find({ regions: "mb" })
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate("promotion", "namePromotion discountPercentage");
  let popular_in_north = tours.slice(0, 6);
  res.send(popular_in_north);
};

//Get popular tours in the Southern
exports.getPopularInSouthern = async (req, res) => {
  let tours = await Tour.find({ regions: "mn" })
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate("promotion", "namePromotion discountPercentage");
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

    const tour = await Tour.findById(tourId)
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Return the found tour if it exists
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

    const tours = await Tour.find({ tourType: tourTypeId })
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");

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

// exports.searchToursAdvanced = async (req, res) => {
//   try {
//     const { nameTour, startDate, price, maxParticipants } = req.query;

//     // Tạo điều kiện tìm kiếm ban đầu là một đối tượng rỗng
//     let searchConditions = {};

//     // if (regions) {
//     //   searchConditions.regions = regions;
//     // }

//     if (nameTour) {
//       searchConditions.nameTour = { $regex: nameTour, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
//     }

//     if (startDate) {
//       // Chỉ tìm các tour có ngày bắt đầu sau ngày được chỉ định
//       searchConditions.startDate = { $gte: new Date(startDate) };
//     }

//     if (price) {
//       // Giả sử price là một chuỗi có dạng "min-max"
//       const [minPrice, maxPrice] = price.split("-").map(Number);
//       searchConditions.price = { $gte: minPrice, $lte: maxPrice || Infinity };
//     }

//     if (maxParticipants) {
//       // Tìm tours với số lượng người tham gia tối đa không vượt quá giá trị được chỉ định
//       searchConditions.maxParticipants = { $gte: Number(maxParticipants) };
//     }

//     const tours = await Tour.find(searchConditions);
//     // .populate("tourType", "typeName")
//     // .populate("tourDirectory", "directoryName")
//     // .populate("promotion", "namePromotion discountPercentage");

//     if (!tours.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No tours found matching the search criteria.",
//       });
//     }

//     res.json({ success: true, tours });
//   } catch (error) {
//     console.error("Error searching for tours:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error searching for tours",
//       error: error.message,
//     });
//   }
// };

// Lấy tất cả các tour có cùng khuyến mãi

exports.searchToursAdvanced = async (req, res) => {
  try {
    const { nameTour, startDate, priceMin, priceMax, maxParticipants } =
      req.query;

    let searchConditions = {};

    if (nameTour) {
      searchConditions.nameTour = { $regex: nameTour, $options: "i" };
    }

    if (startDate) {
      searchConditions.startDate = { $gte: new Date(startDate) };
    }

    if (priceMin || priceMax) {
      searchConditions.price = {};
      if (priceMin) {
        searchConditions.price.$gte = Number(priceMin);
      }
      if (priceMax) {
        searchConditions.price.$lte = Number(priceMax);
      }
    }

    if (maxParticipants) {
      searchConditions.maxParticipants = { $gte: Number(maxParticipants) };
    }

    const tours = await Tour.find(searchConditions);

    if (!tours.length) {
      return res.status(404).json({
        success: false,
        message: "No tours found matching the search criteria.",
      });
    }

    res.json({ success: true, tours });
  } catch (error) {
    console.error("Error searching for tours:", error);
    res.status(500).json({
      success: false,
      message: "Error searching for tours",
      error: error.message,
    });
  }
};

exports.getToursByPromotionId = async (req, res) => {
  try {
    const { promotionId } = req.params;

    // Find tours with the matching promotion ID
    const tours = await Tour.find({ promotion: promotionId })
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");
    if (!tours || tours.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tours found for the specified promotion",
      });
    }

    res.json({
      success: true,
      tours: tours,
    });
  } catch (error) {
    console.error("Error retrieving tours by promotion:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving tours by promotion",
      error: error.message,
    });
  }
};
module.exports = exports;
