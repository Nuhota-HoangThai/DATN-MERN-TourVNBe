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
      userGuide: req.body.userGuide,

      nameTour: req.body.nameTour,
      regions: req.body.regions,
      price: req.body.price,
      priceForChildren: req.body.priceForChildren,
      priceForYoungChildren: req.body.priceForYoungChildren,
      transport: req.body.transport,
      maxParticipants: req.body.maxParticipants,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startingGate: req.body.startingGate,
      convergeTime: req.body.convergeTime,
      description: req.body.description,
      additionalFees: req.body.additionalFees,
      schedule: req.body.schedule,
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
        .json({ success: false, error: "Không tìm thấy tour" });
    }

    res.json({
      success: true,
      message: "Xóa tour thành công",
      deletedTour: deletedTour,
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xóa chuyến tham quan",
      error: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  let update = {
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
    transport: req.body.transport,
    additionalFees: req.body.additionalFees,
    schedule: req.body.schedule,
    userGuide: req.body.userGuide,
    promotion: req.body.promotion,
  };

  if (req.body.userGuide) {
    update.userGuide = req.body.userGuide;
  }

  if (req.files.image && req.files.image.length > 0) {
    update.image = req.files.image.map((file) => file.path);
  }

  if (req.files.video && req.files.video.length > 0) {
    update.video = req.files.video.map((file) => file.path);
  }

  try {
    // Check if guide is available
    if (update.userGuide) {
      const overlappingTours = await Tour.find({
        userGuide: update.userGuide,
        _id: { $ne: id },
        $or: [
          {
            startDate: { $lte: new Date(update.endDate) },
            endDate: { $gte: new Date(update.startDate) },
          },
        ],
      });

      if (overlappingTours.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Hướng dẫn không có sẵn trong phạm vi ngày nhất định.",
        });
      }
    }
    if (update.promotion) {
      const promotion = await Promotion.findById(update.promotion);
      if (!promotion) {
        return res
          .status(404)
          .json({ success: false, error: "Không tìm thấy khuyến mãi" });
      }
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      );

    if (!updatedTour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    res.json({
      success: true,
      message: "Cập nhật tour thành công",
      tour: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật tour",
      error: error.message,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    let tours = await Tour.find({})
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      );

    const now = new Date();

    for (let tour of tours) {
      let tourData = tour.toObject();
      let needUpdate = false;

      // Check if there is a promotion and whether it's currently valid
      if (tourData.promotion) {
        if (
          now >= new Date(tourData.promotion.startDatePromotion) &&
          now <= new Date(tourData.promotion.endDatePromotion)
        ) {
          // The promotion is valid
          if (!tourData.originalPrice) {
            // Save the original prices if they haven't been saved yet
            tourData.originalPrice = tourData.price;
            tourData.originalPriceForChildren = tourData.priceForChildren;
            tourData.originalPriceForYoungChildren =
              tourData.priceForYoungChildren;
          }

          const discountPercentage =
            tourData.promotion.discountPercentage / 100;
          const applyDiscount = (price, discount) => price * (1 - discount);

          // Apply the discount
          tourData.price = applyDiscount(
            tourData.originalPrice,
            discountPercentage
          );
          tourData.priceForChildren = applyDiscount(
            tourData.originalPriceForChildren,
            discountPercentage
          );
          tourData.priceForYoungChildren = applyDiscount(
            tourData.originalPriceForYoungChildren,
            discountPercentage
          );

          needUpdate = true; // Flag that we need to update the tour document
        } else {
          // The promotion is not valid; revert prices if original prices are saved
          if (tourData.originalPrice) {
            tourData.price = tourData.originalPrice;
            tourData.priceForChildren = tourData.originalPriceForChildren;
            tourData.priceForYoungChildren =
              tourData.originalPriceForYoungChildren;

            needUpdate = true; // Flag that we need to update the tour document
          }
        }
      }

      // Update the tour if needed
      if (needUpdate) {
        await Tour.findByIdAndUpdate(tour._id, {
          $set: {
            price: tourData.price,
            priceForChildren: tourData.priceForChildren,
            priceForYoungChildren: tourData.priceForYoungChildren,
            priceForInfants: tourData.priceForInfants,
            originalPrice: tourData.originalPrice,
            originalPriceForChildren: tourData.originalPriceForChildren,
            originalPriceForYoungChildren:
              tourData.originalPriceForYoungChildren,
          },
        });
      }
    }

    // Refetch the tours after updates
    tours = await Tour.find({})
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      );
    res.json({ tours });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tìm nạp các tours",
      error: error.message,
    });
  }
};

exports.getAllToursLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
    const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
    const skip = (page - 1) * limit;

    // Tính tổng số sản phẩm để có thể tính tổng số trang
    const totalTours = await Tour.countDocuments();
    const totalPages = Math.ceil(totalTours / limit);

    let tours = await Tour.find({})
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      )
      .sort({ createdAt: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);

    const now = new Date();

    for (let tour of tours) {
      let tourData = tour.toObject();
      let needUpdate = false;

      // Kiểm tra và áp dụng khuyến mãi nếu có
      if (
        tourData.promotion &&
        now >= new Date(tourData.promotion.startDatePromotion) &&
        now <= new Date(tourData.promotion.endDatePromotion)
      ) {
        // Save the original prices before they are modified by the promotion, if not already saved
        if (!tourData.originalPrice) {
          tourData.originalPrice = tourData.price;
          tourData.originalPriceForChildren = tourData.priceForChildren;
          tourData.originalPriceForYoungChildren =
            tourData.priceForYoungChildren;
          needUpdate = true; // Flag that we need to update the tour document
        }
        const discountPercentage = tourData.promotion.discountPercentage / 100;

        const applyDiscount = (price, discountPercentage) => {
          return price * (1 - discountPercentage); // Giảm giá dựa trên phần trăm
        };

        // Áp dụng giảm giá cho các loại giá vé
        tourData.price = applyDiscount(
          tourData.originalPrice || tourData.price,
          discountPercentage
        );
        tourData.priceForChildren = applyDiscount(
          tourData.originalPriceForChildren || tourData.priceForChildren,
          discountPercentage
        );
        tourData.priceForYoungChildren = applyDiscount(
          tourData.originalPriceForYoungChildren ||
            tourData.priceForYoungChildren,
          discountPercentage
        );

        needUpdate = true;
      }

      // Cập nhật tour nếu có thay đổi giá
      if (needUpdate) {
        await Tour.findByIdAndUpdate(tour._id, {
          $set: {
            price: tourData.price,
            priceForChildren: tourData.priceForChildren,
            priceForYoungChildren: tourData.priceForYoungChildren,
            priceForInfants: tourData.priceForInfants,
            originalPrice: tourData.originalPrice,
            originalPriceForChildren: tourData.originalPriceForChildren,
            originalPriceForYoungChildren:
              tourData.originalPriceForYoungChildren,
          },
        });
      }
    }

    // Lấy lại danh sách tour đã cập nhật để phản hồi
    tours = await Tour.find({})
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      )
      .sort({ createdAt: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
      .skip(skip)
      .limit(limit);

    res.json({
      tours: tours,
      page,
      limit,
      totalPages,
      totalTours,
    });
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
    .populate("userGuide", "name phone address")
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate(
      "promotion",
      "namePromotion discountPercentage startDatePromotion endDatePromotion"
    );
  let newCollection = tours.slice(1).slice(-8);
  res.send(newCollection);
};

// Get popular tours in the central region
exports.getPopularInCentral = async (req, res) => {
  let tours = await Tour.find({ regions: "mt" })
    .populate("userGuide", "name phone address")
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate("promotion", "namePromotion discountPercentage");
  let popular_in_central = tours.slice(0, 6);
  res.send(popular_in_central);
};

//Get popular tours in the North
exports.getPopularInNorth = async (req, res) => {
  let tours = await Tour.find({ regions: "mb" })
    .populate("userGuide", "name phone address")
    .populate("tourType", "typeName")
    .populate("tourDirectory", "directoryName")
    .populate("promotion", "namePromotion discountPercentage");
  let popular_in_north = tours.slice(0, 6);
  res.send(popular_in_north);
};

//Get popular tours in the Southern
exports.getPopularInSouthern = async (req, res) => {
  let tours = await Tour.find({ regions: "mn" })
    .populate("userGuide", "name phone address")
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
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    res.json({ success: true, tour: tour });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi tìm chuyến tham quan",
      error: error.message,
    });
  }
};

// Lấy tất cả các tour có cùng loại tour
exports.getToursByTourTypeId = async (req, res) => {
  try {
    const { tourTypeId } = req.params;

    const tours = await Tour.find({ tourType: tourTypeId })
      .populate("userGuide", "name phone address")
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
      error: "Lỗi truy xuất chuyến tham quan theo loại chuyến tham quan",
    });
  }
};

// Lấy tất cả các tour có cùng danh mục tour
exports.getToursByTourDirectoryId = async (req, res) => {
  try {
    const { tourDirectoryId } = req.params;

    const tours = await Tour.find({ tourDirectory: tourDirectoryId })
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        error: "Không có tour thuộc danh mục này.",
      });
    }

    res.json({
      success: true,
      tours: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi truy xuất chuyến tham quan theo danh mục chuyến tham quan",
      error: error.message,
    });
  }
};

// Lấy các tour cá nhân hướng dẫn viên đang được phân công
exports.getToursByGuide = async (req, res) => {
  try {
    const { userGuideId } = req.params;

    const tours = await Tour.find({ userGuide: userGuideId })
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Bạn chưa được phân công tour nào.",
      });
    }

    res.json({
      success: true,
      tours: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi truy xuất chuyến tham quan theo hướng dẫn",
      error: error.message,
    });
  }
};

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
        error:
          "Không tìm thấy chuyến tham quan nào phù hợp với tiêu chí tìm kiếm.",
      });
    }

    res.json({ success: true, tours });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi tìm kiếm tour",
    });
  }
};

// lấy các tour có khuyến mãi
exports.getToursByPromotionId = async (req, res) => {
  try {
    const { promotionId } = req.params;

    // Find tours with the matching promotion ID
    const tours = await Tour.find({ promotion: promotionId })
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate("promotion", "namePromotion discountPercentage");
    if (!tours || tours.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          "Không tìm thấy chuyến tham quan nào cho chương trình khuyến mãi được chỉ định",
      });
    }

    res.json({
      success: true,
      tours: tours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi truy xuất tour theo khuyến mãi",
    });
  }
};

// lấy tất cả các tour có hướng dẫn viên
exports.getAllToursGuide = async (req, res) => {
  try {
    // Chỉ lấy những tours có hướng dẫn viên
    let tours = await Tour.find({ userGuide: { $ne: null } })
      .populate("userGuide", "name phone address")
      .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      );

    const now = new Date();

    for (let tour of tours) {
      let tourData = tour.toObject();
      let needUpdate = false;

      // Kiểm tra và áp dụng khuyến mãi nếu có
      if (
        tourData.promotion &&
        now >= new Date(tourData.promotion.startDatePromotion) &&
        now <= new Date(tourData.promotion.endDatePromotion)
      ) {
        const discountPercentage = tourData.promotion.discountPercentage / 100;
        const applyDiscount = (price, discountPercentage) => {
          return price * (1 - discountPercentage);
        };

        // Áp dụng giảm giá cho các loại giá vé
        tourData.price = applyDiscount(
          tourData.originalPrice || tourData.price,
          discountPercentage
        );
        tourData.priceForChildren = applyDiscount(
          tourData.originalPriceForChildren || tourData.priceForChildren,
          discountPercentage
        );
        tourData.priceForYoungChildren = applyDiscount(
          tourData.originalPriceForYoungChildren ||
            tourData.priceForYoungChildren,
          discountPercentage
        );

        needUpdate = true;
      }

      // Cập nhật tour nếu có thay đổi giá
      if (needUpdate) {
        await Tour.findByIdAndUpdate(tour._id, {
          $set: {
            price: tourData.price,
            priceForChildren: tourData.priceForChildren,
            priceForYoungChildren: tourData.priceForYoungChildren,
            priceForInfants: tourData.priceForInfants,
          },
        });
      }
    }

    // Lấy lại danh sách tours đã cập nhật để phản hồi
    tours = await Tour.find({ userGuide: { $ne: null } })
      .populate("userGuide", "name phone address")
      // .populate("tourType", "typeName")
      .populate("tourDirectory", "directoryName")
      .populate(
        "promotion",
        "namePromotion discountPercentage startDatePromotion endDatePromotion"
      );

    res.json({
      tours: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tìm nạp các chuyến tham quan",
      error: error.message,
    });
  }
};

module.exports = exports;
