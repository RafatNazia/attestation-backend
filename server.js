const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// ✅ ADD THESE — without these, req.body will be undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: false  // ✅ set false when origin is '*'
}));

app.use('/api/inquiry', require('./routes/inquiry'));
app.use('/api/track', require('./routes/tracking'));
app.use('/api/upload', require('./routes/upload'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', '*'],
  methods: ['GET', 'POST'],
  credentials: true
}));

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