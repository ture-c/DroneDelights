const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware"); 

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems, // Förväntar mig en array av { productId, name, quantity, price }
      deliveryAddress, // Objekt med name, street, city etc.
      paymentMethod,
      totalAmount,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ msg: "No order items" });
    }

    if (!deliveryAddress || !paymentMethod || !totalAmount) {
      return res
        .status(400)
        .json({ msg: "Please provide all required order details" });
    }

    const order = new Order({
      user: req.user.id, // Från protect middleware (req.session.userId)
      items: orderItems.map((item) => ({
        // Mappa till OrderItemSchema
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryAddress: {
        name: deliveryAddress.name,
        street: deliveryAddress.street,
        houseNumber: deliveryAddress.houseNumber,
        city: deliveryAddress.city,
        zipCode: deliveryAddress.zipCode,
        phone: deliveryAddress.phone,
      },
      paymentMethod,
      totalAmount,
      
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ msg: "Validation Error", errors: error.errors });
    }
    res.status(500).json({ msg: "Server Error while creating order" });
  }
});

// Update order status
router.patch("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.status) {
      order.status = req.body.status;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
