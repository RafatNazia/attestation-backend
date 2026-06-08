const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, documentType, country, message } = req.body;

    console.log('📩 Form data:', { name, phone, email });
    console.log('📧 RESEND_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('📧 ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

    // 1. MongoDB save
    const inquiry = new Inquiry({ name, phone, email, documentType, country, message });
    await inquiry.save();
    console.log('✅ MongoDB saved');

    // 2. Email via Resend
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
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
    console.log('✅ Mail sent!', result);

    // 3. WhatsApp link
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
    console.error('❌ ERROR =>', err.message);
    console.error('❌ FULL ERROR =>', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
