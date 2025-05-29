const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    street: { type: String, trim: true, default: "" },
    houseNumber: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    zipCode: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
