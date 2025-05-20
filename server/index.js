const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Drone Delights API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));