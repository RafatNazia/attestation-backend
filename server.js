const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/track', require('./routes/tracking'));
app.use('/api/upload', require('./routes/upload'));

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});