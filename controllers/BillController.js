const nodemailer = require("nodemailer");

const Bill = require("../models/Bill"); // Giả sử đường dẫn này là đúng
const Booking = require("../models/Booking"); // Thêm dòng này để sử dụng model Booking

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thai2402@gmail.com", // Thay thế bằng email của bạn
    pass: "thai2402", // Thay thế bằng mật khẩu của bạn
  },
});

const sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: "thai2402@gmail.com", // Thay thế bằng email của bạn
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

const BillController = {
  createBill: async (req, res) => {
    try {
      // Extract bookingId and notesBill from the request body
      const { booking: bookingId, notesBill } = req.body;

      // Find the Booking based on the ID
      const booking = await Booking.findById(bookingId)
        .populate("user")
        .populate("tour");
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const newBillDetails = {
        booking: booking._id,
        user: booking.user._id, // Ensure you're using the ID
        tour: booking.tour._id, // Ensure you're using the ID
        totalCost: booking.totalAmount, // Assuming totalAmount is provided in the Booking
        notesBill: notesBill,

        numberOfAdultsBill: booking.numberOfAdults,
        numberOfChildrenBill: booking.numberOfChildren,
        numberOfYoungChildrenBill: booking.numberOfYoungChildren,
        numberOfInfantsBill: booking.numberOfInfants,

        bookingDateBill: booking.bookingDate,
        statusBill: booking.status,
        paymentStatusBill: booking.paymentStatus,
        //paymentMethodBill: booking.paymentMethod,

        adultPriceBill: booking.adultPrice,
        childPriceBill: booking.childPrice,
        youngChildrenPriceBill: booking.youngChildrenPrice,
        infantPriceBill: booking.infantPrice,
        surchargeBill: booking.surcharge,
      };

      const newBill = new Bill(newBillDetails);
      const savedBill = await newBill.save();

      // Gửi email
      await sendEmail(
        booking.user.email, // Giả sử booking.user có trường email
        "Hóa đơn của bạn đã được tạo",
        `Xin chào ${booking.user.name}, hóa đơn của bạn đã được tạo thành công. Chi tiết: ${savedBill}`
      );

      res.status(201).json(savedBill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getAllBills: async (req, res) => {
    try {
      const bills = await Bill.find()
        .populate("booking")
        .populate("user")
        .populate("tour");
      res.json(bills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Thêm hàm mới để xóa một bill
  deleteBill: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBill = await Bill.findByIdAndDelete(id);
      if (!deletedBill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      res.status(204).json({ message: "Bill deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBillDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const bill = await Bill.findById(id)
        .populate("booking")
        .populate("user")
        .populate("tour");

      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      res.json(bill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = BillController;
