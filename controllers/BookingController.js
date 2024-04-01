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
      //
      numberOfYoungChildren,
      //
      numberOfInfants,
      bookingDate,
      priceOfAdults,
      priceForChildren,
      priceForInfants,
      priceForYoungChildren,
      surcharge,
      totalAmount,
      additionalInformation,
    } = req.body;
    const user = req.user;

    try {
      const tourDetails = await Tour.findById(tourId);

      if (!tourDetails) {
        return res.status(404).json({ message: "Tour not found" });
      }

      const totalParticipants =
        parseInt(numberOfAdults) +
        parseInt(numberOfChildren) +
        parseInt(numberOfYoungChildren) +
        parseInt(numberOfInfants);
      if (totalParticipants <= 0) {
        return res
          .status(400)
          .json({ message: "At least one participant is required" });
      }
      // Kiểm tra xem số lượng người đăng ký có vượt quá số lượng chỗ còn lại hay không
      if (tourDetails.maxParticipants < totalParticipants) {
        return res
          .status(400)
          .json({ message: "Not enough spots available on the tour" });
      }

      // Proceed to create the order if there are enough spots
      const newBooking = new Booking({
        user: user.id,
        tour: tourId,
        bookingDate,
        numberOfChildren: numberOfChildren,
        numberOfAdults: numberOfAdults,
        numberOfYoungChildren: numberOfYoungChildren,
        numberOfInfants: numberOfInfants,
        /////
        adultPrice: priceOfAdults,
        childPrice: priceForChildren,
        youngChildrenPrice: priceForYoungChildren,
        infantPrice: priceForInfants,

        surcharge,
        /////
        totalAmount,
        additionalInformation,
      });

      const savedBooking = await newBooking.save();

      // Cập nhật số lượng chỗ còn lại trên tour
      tourDetails.maxParticipants -= totalParticipants; // Trừ số người tham gia khỏi maxParticipants
      await tourDetails.save();

      res.status(201).json(savedBooking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  removeBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({
        success: true,
        message: "Booking successfully deleted",
        deletedBooking: deletedBooking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error while deleting booking",
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
          .json({ message: "No bookings found for this user" });
      }
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(bookingDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error retrieving booking details",
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
      res.status(500).json({ message: error.message });
    }
  },

  // Confirm order status
  confirmBookingStatus: async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: status },
        { new: true }
      );
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
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
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending Bookings can be cancelled" });
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
      numberOfInfants,
      bookingDate,
      priceOfAdults,
      priceForChildren,
      priceForInfants,
      priceForYoungChildren,
      surcharge,
      totalAmount,
      additionalInformation,
      paymentStatus,
    } = req.body;

    const user = req.user;
    try {
      console.log(req.body);
      const tourDetails = await Tour.findById(tourId);
      if (!tourDetails) {
        return res.status(404).json({ message: "Tour not found" });
      }

      const totalParticipants =
        parseInt(numberOfAdults) +
        parseInt(numberOfChildren) +
        parseInt(numberOfYoungChildren) +
        parseInt(numberOfInfants);

      if (totalParticipants <= 0) {
        return res
          .status(400)
          .json({ message: "At least one participant is required" });
      }

      if (tourDetails.maxParticipants < totalParticipants) {
        return res
          .status(400)
          .json({ message: "Not enough spots available on the tour" });
      }

      const newBooking = new Booking({
        user: user.id,
        tour: tourId,
        bookingDate,
        numberOfChildren,
        numberOfAdults,
        numberOfYoungChildren,
        numberOfInfants,
        adultPrice: priceOfAdults,
        childPrice: priceForChildren,
        youngChildrenPrice: priceForYoungChildren,
        infantPrice: priceForInfants,
        surcharge,
        totalAmount,
        additionalInformation,
        paymentStatus,
      });
      newBooking.paymentStatus = "paid";
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
      var returnUrl = `http://localhost:5174/booking/payment_vnpay_return?totalAmount=${totalAmount}&surcharge=${surcharge}`;

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
        message: "Booking saved and payment URL generated successfully",
        vnpUrl,
        bookingId,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
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
