const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId:      { type: String, unique: true },
  customerName: { type: String },
  phone:        { type: String },
  documentType: { type: String },
  country:      { type: String },
  status: {
    type: String,
    enum: ['Received','Verification','HRD','MEA','Embassy','Dispatched','Delivered'],
    default: 'Received'
  },
  documents: [{ url: String, publicId: String }],
  timeline: [{
    stage:     String,
    updatedAt: { type: Date, default: Date.now },
    note:      String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);