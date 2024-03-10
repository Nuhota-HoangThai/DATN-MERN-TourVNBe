const Order = require("../models/Order"); // Adjust the path as necessary to where your Order model is located
const Tour = require("../models/Tour");

const OrderController = {
  // Create a new order
  createOrder: async (req, res) => {
    const {
      user,
      tour,
      children,
      adults,
      orderDate,
      totalAmount,
      additionalInformation,
    } = req.body;

    try {
      const tourDetails = await Tour.findById(tour);

      if (!tourDetails) {
        return res.status(404).json({ message: "Tour not found" });
      }

      const totalParticipants = children + adults;
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
      const newOrder = new Order({
        user,
        tour,
        orderDate,
        numberOfChildren: children,
        numberOfAdults: adults,
        totalAmount,
        additionalInformation,
      });

      const savedOrder = await newOrder.save();

      // Cập nhật số lượng chỗ còn lại trên tour
      tourDetails.maxParticipants -= totalParticipants; // Trừ số người tham gia khỏi maxParticipants
      await tourDetails.save();

      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy tất cả các order của một khách hàng dựa trên userId
  listOrdersByUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const orders = await Order.find({ user: userId })
        .populate("user")
        .populate("tour");
      if (orders.length === 0) {
        return res
          .status(404)
          .json({ message: "No orders found for this user" });
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // List all orders
  listOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("user").populate("tour");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Confirm order status
  confirmOrderStatus: async (req, res) => {
    const { status } = req.body; // Get the new status from the request body
    const orderId = req.params.id; // Get the order ID from the request parameters

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending orders can be cancelled" });
      }

      order.status = "cancelled";
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = OrderController;
