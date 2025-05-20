const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);