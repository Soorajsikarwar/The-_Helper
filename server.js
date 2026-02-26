// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // To use environment variables from .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// CORS allows your frontend (running on a different port) to communicate with this backend.
app.use(cors());
// BodyParser helps to parse the incoming request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Nodemailer Transporter Setup ---
// This transporter uses your email service credentials to send emails.
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider (e.g., 'gmail', 'yahoo')
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env file
    pass: process.env.EMAIL_PASS, // Your email app password from .env file
  },
});

// --- API Endpoint for Contact Form ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. --- Input Validation ---
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // 2. --- Email to You (the Admin) ---
    const mailOptionsToAdmin = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `<h2>New Message from Portfolio</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    };

    // 3. --- Auto-Reply Email to the User ---
    const mailOptionsToUser = {
      from: `"Sooraj Sikarwar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We have received your message!',
      html: `<h2>Thank You, ${name}!</h2><p>I have received your message and will get back to you as soon as possible.</p><br><p>Best regards,<br>Sooraj Sikarwar</p>`,
    };

    // 4. --- Send Both Emails Concurrently ---
    await Promise.all([
      transporter.sendMail(mailOptionsToAdmin),
      transporter.sendMail(mailOptionsToUser)
    ]);

    // 5. --- Send Success Response ---
    res.status(200).json({ success: true, message: 'Message sent successfully! Please check your inbox for a confirmation.' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});