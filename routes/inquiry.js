const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/inquiry
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, documentType, country, message } = req.body;

    // 1. Save to MongoDB
    const inquiry = new Inquiry({ name, phone, email, documentType, country, message });
    await inquiry.save();

    // 2. Email to Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 New Inquiry - ${name}`,
      html: `
        <h2>New Attestation Inquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Document:</b> ${documentType}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    // 3. WhatsApp to Customer via WATI
    await axios.post(
      `${process.env.WATI_BASE_URL}/api/v1/sendTemplateMessage`,
      {
        template_name: 'inquiry_received',
        broadcast_name: 'inquiry',
        receivers: [{ whatsappNumber: `91${phone}` }]
      },
      { headers: { Authorization: `Bearer ${process.env.WATI_API_KEY}` } }
    );

    res.json({ success: true, message: 'Inquiry submitted successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

module.exports = router;