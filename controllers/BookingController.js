const Booking = require("../models/Booking"); // Adjust the path as necessary to where your Order model is located
const Tour = require("../models/Tour");

const crypto = require("crypto");
const qs = require("qs");
// const cloudinary = require("cloudinary");
const moment = require("moment");

const BookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    const {
      tourId,
      numberOfAdults,
      numberOfChildren,
      numberOfYoungChildren,

      singleRoomNumber,
      bookingDate,
      priceOfAdults,
      priceForChildren,

      priceForYoungChildren,
      surcharge,
      totalAmount,
      additionalInformation,
      paymentMethod,
    } = req.body;
    const user = req.user;

    try {
      // console.log(req.body);
      const tourDetails = await Tour.findById(tourId);

      if (!tourDetails) {
        return res.status(400).json({ error: "Không tìm thấy tour." });
      }

      const totalParticipants =
        parseInt(numberOfAdults) +
        parseInt(numberOfChildren) +
        parseInt(numberOfYoungChildren);

      if (totalParticipants <= 0) {
        return res
          .status(400)
          .json({ error: "Cần có ít nhất một người tham gia." });
      }
      // Kiểm tra xem số lượng người đăng ký có vượt quá số lượng chỗ còn lại hay không
      if (tourDetails.maxParticipants < totalParticipants) {
        return res
          .status(400)
          .json({ error: "Số lượng chỗ không đủ cho quý khách." });
      }

      const newBooking = new Booking({
        user: user.id,
        tour: tourId,
        bookingDate,
        numberOfChildren: numberOfChildren,
        numberOfAdults: numberOfAdults,
        numberOfYoungChildren: numberOfYoungChildren,
        singleRoomNumber: singleRoomNumber,
        adultPrice: priceOfAdults,
        childPrice: priceForChildren,
        youngChildrenPrice: priceForYoungChildren,
        surcharge,
        paymentMethod,
        totalAmount,
        additionalInformation,
      });
      newBooking.paymentMethod = "Unpaid";
      const savedBooking = await newBooking.save();

      // Cập nhật số lượng chỗ còn lại trên tour
      tourDetails.maxParticipants -= totalParticipants; // Trừ số người tham gia khỏi maxParticipants
      await tourDetails.save();

      res
        .status(201)
        .json({ booking: savedBooking, message: "Đặt tour thành công." });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Required fields are missing or invalid." });
    }
  },

  removeBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) {
        return res.status(404).json({ error: "Không tìm thấy đặt chỗ" });
      }
      res.json({
        success: true,
        message: "Xóa booking thành công.",
        deletedBooking: deletedBooking,
      });
    } catch (error) {
      //console.error(error);
      res.status(500).json({
        success: false,
        error: "Lỗi khi xóa đặt chỗ",
      });
    }
  },

  // Lấy tất cả các order của một khách hàng dựa trên userId
  listBookingsByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const bookings = await Booking.find({ user: userId })
        .populate("user")
        .populate("tour");
      if (bookings.length === 0) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy đặt chỗ của bạn." });
      }
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Không lấy được danh sách." });
    }
  },

  // lấy chi tiêt 1 đơn hàng'
  getBookingDetails: async (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số truyền vào

    try {
      const bookingDetails = await Booking.findById(id)
        .populate("user")
        .populate("tour"); // Sử dụng populate để lấy thông tin chi tiết về user và tour

      if (!bookingDetails) {
        return res.status(404).json({ error: "Không tìm thấy đặt chỗ" });
      }

      res.json(bookingDetails);
    } catch (error) {
      // console.error(error);
      res.status(500).json({
        error: error.message,
      });
    }
  },

  // List all orders
  listBookings: async (req, res) => {
    try {
      const bookings = await Booking.find().populate("user").populate("tour");

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  listBookingsLimit: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
      const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
      const skip = (page - 1) * limit;

      // Tính tổng số Booking để có thể tính tổng số trang
      const totalBookings = await Booking.countDocuments();
      const totalPages = Math.ceil(totalBookings / limit);

      const bookings = await Booking.find()
        .populate("user")
        .populate("tour")
        .sort({ bookingDate: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
        .skip(skip)
        .limit(limit);

      res.json({
        bookings,
        page,
        limit,
        totalPages,
        totalBookings,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  confirmBookingStatus: async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    try {
      const updateData = { status: status };

      // Automatically set paymentStatus to 'paid' if status is 'completed'
      if (status === "completed") {
        updateData.paymentStatus = "paid";
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        updateData,
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ error: "Không tìm thấy đặt tour" });
      }

      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({ error: "Không tìm thấy đặt tour" });
      }

      if (booking.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Đặt tour đang chờ xử lý mới có thể hủy" });
      }

      booking.status = "cancelled";
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addOrderByVNPay: async (req, res) => {
    const {
      tourId,
      numberOfAdults,
      numberOfChildren,
      numberOfYoungChildren,
      singleRoomNumber,
      bookingDate,
      priceOfAdults,
      priceForChildren,
      priceForYoungChildren,
      surcharge,
      totalAmount,
      additionalInformation,
      paymentStatus,
      paymentMethod,
    } = req.body;

    const user = req.user;
    try {
      // console.log(req.body);
      const tourDetails = await Tour.findById(tourId);
      if (!tourDetails) {
        return res.status(404).json({ error: "Không tìm thấy tour." });
      }

      const totalParticipants =
        parseInt(numberOfAdults) +
        parseInt(numberOfChildren) +
        parseInt(numberOfYoungChildren);

      if (totalParticipants <= 0) {
        return res
          .status(400)
          .json({ error: "Cần có ít nhất một người tham gia." });
      }

      if (tourDetails.maxParticipants < totalParticipants) {
        return res
          .status(400)
          .json({ error: "Không có đủ chỗ trong tour này." });
      }

      const newBooking = new Booking({
        user: user.id,
        tour: tourId,
        bookingDate,
        numberOfChildren,
        numberOfAdults,
        numberOfYoungChildren,
        singleRoomNumber,
        adultPrice: priceOfAdults,
        childPrice: priceForChildren,
        youngChildrenPrice: priceForYoungChildren,
        surcharge,
        totalAmount,
        additionalInformation,
        paymentStatus,
        paymentMethod,
      });
      newBooking.paymentStatus = "paid";
      newBooking.paymentMethod = "VNPay";
      await newBooking.save();
      tourDetails.maxParticipants -= totalParticipants;
      await tourDetails.save();

      var ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      var tmnCode = "5I5PNIK3";
      var secretKey = "QUXPZIAVAUZHVGUPFGFHGNWVBECPRFEJ";
      var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      var returnUrl = `http://localhost:5174/booking/payment_vnpay_return?bookingId=${newBooking._id}`;

      const date = new Date();
      const createDate = moment(date).format("YYYYMMDDHHmmss");
      var bookingId = moment(date).format("DDHHmmss");
      var bankCode = "NCB";
      var orderType = "billpayment";
      var locale = "vn";
      var currCode = "VND";
      var vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: bookingId,
        vnp_OrderInfo: `Thanh toan cho ma GD: ${bookingId}`,
        vnp_OrderType: orderType,
        vnp_Amount: totalAmount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };

      if (bankCode) {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);
      const signData = qs.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params.vnp_SecureHash = signed;
      vnpUrl += `?${qs.stringify(vnp_Params, { encode: false })}`;

      // Chỉ gửi một response ở đây
      return res.json({
        code: "00",
        message: "Đã lưu đặt phòng và tạo URL thanh toán thành công",
        vnpUrl,
        bookingId,
      });
    } catch (error) {
      //console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Lấy danh sách người dùng đã đặt tour này
  getBookingsByTour: async (req, res) => {
    const { tourId } = req.params;

    try {
      const bookings = await Booking.find({ tour: tourId })
        .populate("user", "name email phone")
        .populate("tour", "nameTour")
        .exec();

      res.json({
        success: true,
        bookings: bookings,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi truy xuất thông tin đặt chỗ",
        error: error.message,
      });
    }
  },
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = BookingController;
