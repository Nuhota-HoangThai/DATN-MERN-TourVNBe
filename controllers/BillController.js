const Bill = require("../models/Bill"); // Giả sử đường dẫn này là đúng
const Booking = require("../models/Booking"); // Thêm dòng này để sử dụng model Booking

const { sendEmailService } = require("../service/EmailService");

const BillController = {
  sendEmail: async (req, res) => {
    const { email, billId } = req.body;

    try {
      // Tìm thông tin bill
      const bill = await Bill.findById(billId)
        .populate("booking")
        .populate("user")
        .populate("tour");

      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      // Tạo nội dung email từ thông tin bill
      const content = `
        <h1>Thông Tin Hóa Đơn</h1>
        <p><strong>Mã hóa đơn:</strong> ${bill._id}</p>
        <p><strong>Khách hàng:</strong> ${bill.user.name}</p>
        <p><strong>Tour:</strong> ${bill.tour.nameTour}</p>
        <p><strong>Tổng cộng:</strong> ${bill.totalCost} đ</p>
      `;

      // Gửi email
      const response = await sendEmailService(email, content);
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createBill: async (req, res) => {
    try {
      const { booking: bookingId } = req.body;

      const booking = await Booking.findById(bookingId)
        .populate("user")
        .populate("tour");
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const newBillDetails = {
        booking: booking._id,
        user: booking.user._id,
        tour: booking.tour._id,
        totalCost: booking.totalAmount,
        //notesBill: notesBill,

        numberOfAdultsBill: booking.numberOfAdults,
        numberOfChildrenBill: booking.numberOfChildren,
        numberOfYoungChildrenBill: booking.numberOfYoungChildren,
        numberOfInfantsBill: booking.numberOfInfants,

        bookingDateBill: booking.bookingDate,
        statusBill: booking.status,
        paymentStatusBill: booking.paymentStatus,

        adultPriceBill: booking.adultPrice,
        childPriceBill: booking.childPrice,
        youngChildrenPriceBill: booking.youngChildrenPrice,
        infantPriceBill: booking.infantPrice,
        surchargeBill: booking.surcharge,
      };

      const newBill = new Bill(newBillDetails);
      const savedBill = await newBill.save();

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
