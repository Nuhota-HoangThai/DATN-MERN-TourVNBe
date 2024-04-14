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
        <h1>Quý khách hàng xem chi tiết hóa đơn bằng cách vào website tại thanh tìm kiếm chọn tra cứu hóa đơn, nhập mã hóa đơn và tìm kiếm</h1>
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

        bookingDateBill: booking.bookingDate,
        statusBill: booking.status,
        paymentStatusBill: booking.paymentStatus,
        singleRoomNumberBill: booking.singleRoomNumber,
        adultPriceBill: booking.adultPrice,
        childPriceBill: booking.childPrice,
        youngChildrenPriceBill: booking.youngChildrenPrice,
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

  getAllBillsLimit: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1 nếu không được cung cấp
      const limit = parseInt(req.query.limit) || 7; // Giới hạn số lượng sản phẩm mỗi trang, mặc định là 8
      const skip = (page - 1) * limit;

      // Tính tổng số Booking để có thể tính tổng số trang
      const totalBills = await Bill.countDocuments();
      const totalPages = Math.ceil(totalBills / limit);

      const bills = await Bill.find()
        .populate("booking")
        .populate("user")
        .populate("tour")
        .sort({ bookingDateBill: -1 }) // Giả sử mỗi tour có trường `createdAt`, sắp xếp giảm dần để sản phẩm mới nhất đứng đầu
        .skip(skip)
        .limit(limit);

      res.json({
        bills,
        page,
        limit,
        totalPages,
        totalBills,
      });
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

  searchBillById: async (req, res) => {
    try {
      // Lấy mã hóa đơn từ tham số của request
      const { billId } = req.params;

      // Tìm hóa đơn dựa trên mã được cung cấp
      const bill = await Bill.findById(billId)
        .populate("booking")
        .populate("user")
        .populate("tour");

      if (!bill) {
        // Nếu không tìm thấy hóa đơn, trả về thông báo lỗi
        return res.status(404).json({ message: "Bill not found" });
      }

      // Nếu tìm thấy hóa đơn, trả về hóa đơn đó
      res.json(bill);
    } catch (error) {
      // Trong trường hợp có lỗi xảy ra, trả về thông báo lỗi
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = BillController;
