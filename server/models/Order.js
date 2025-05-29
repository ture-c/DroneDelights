const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
    required: true,
  },
  name: {
    // Lagrar namnet vid beställningstillfället ifall produktnamnet ändras senare
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    // Pris per enhet vid beställningstillfället
    type: Number,
    required: true,
  },
});

const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: String },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String }, // Telefonnummer från betalningsformuläret
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["card", "swish"],
  },
  paymentStatus: {
    // Kan utökas senare (pending, completed, failed)
    type: String,
    default: "completed", // Förutsätter att "fake" betalning alltid lyckas
  },
  orderStatus: {
    type: String,
    default: "Pending", // Ex: Pending, Processing, Shipped, Delivered, Cancelled
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
