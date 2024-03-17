const Booking = require("../models/Booking"); // Adjust the path as necessary to where your Order model is located
const Tour = require("../models/Tour");

const BookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    const {
      tourId,
      numberOfAdults,
      numberOfChildren,
      bookingDate,
      totalAmount,
      additionalInformation,
    } = req.body;
    const user = req.user;
    console.log("Booking created", req.body);

    try {
      const tourDetails = await Tour.findById(tourId);

      if (!tourDetails) {
        return res.status(404).json({ message: "Tour not found" });
      }

      const totalParticipants =
        parseInt(numberOfAdults) + parseInt(numberOfChildren);
      console.log("so luong: ", totalParticipants);
      if (totalParticipants <= 0) {
        return res
          .status(400)
          .json({ message: "At least one participant is required" });
      }
      //console.log("tour: ", tourDetails);
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
    const { status } = req.body; // Get the new status from the request body
    const bookingId = req.params.id; // Get the book ID from the request parameters

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
};

module.exports = BookingController;
