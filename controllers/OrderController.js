const Order = require("../models/Order"); // Adjust the path as necessary to where your Order model is located

const OrderController = {
  // Create a new order
  createOrder: async (req, res) => {
    const { user, tour, children, adults, totalAmount, additionalInformation } =
      req.body;

    try {
      console.log(tour);
      const newOrder = new Order({
        user,
        tour,
        numberOfChildren: children,
        numberOfAdults: adults,
        totalAmount,
        additionalInformation,
      });

      const savedOrder = await newOrder.save();
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

  // Update an order
  updateOrder: async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete an order
  deleteOrder: async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      if (!deletedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(204).send();
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
};

module.exports = OrderController;
