const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, documentType, country, message } = req.body;

    // 1. MongoDB save
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

    // 3. WhatsApp link response mein bhejo
    const whatsappMsg = encodeURIComponent(
      `🔔 New Inquiry!\nName: ${name}\nPhone: ${phone}\nDocument: ${documentType}\nCountry: ${country}`
    );
    const whatsappLink = `https://wa.me/918340383168?text=${whatsappMsg}`;

    res.json({
      success: true,
      message: '✅ Inquiry submitted successfully!',
      whatsappLink
    });

  } catch (err) {
    console.error('ERROR =>', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;