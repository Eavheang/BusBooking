const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/busBookings'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define Booking Schema and Model
const bookingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  origin: String,
  destination: String,
  travelDate: String,
  ticketCount: Number,
  totalPrice: Number,
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'oengeavheang@gmail.com',
    pass: 'nrga ydob qhlg npzv',
  },
});

// POST endpoint to confirm booking
app.post('/api/confirmBooking', async (req, res) => {
    const { firstName, lastName, email, origin, destination, travelDate, ticketCount, totalPrice } = req.body;
  
    if (!firstName || !lastName || !email || !origin || !destination || !travelDate || !ticketCount || !totalPrice) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    try {
      console.log('Attempting to save booking to MongoDB...');
      const booking = new Booking({
        firstName,
        lastName,
        email,
        origin,
        destination,
        travelDate,
        ticketCount,
        totalPrice,
      });
      await booking.save();
  
      console.log('Booking saved to MongoDB. Attempting to send email...');
      const bookingMessage = `Hello ${firstName} ${lastName},\n\nYour booking has been confirmed.\nFrom: ${origin}\nTo: ${destination}\nTravel Date: ${travelDate}\nTicket Count: ${ticketCount}\nTotal Price: $${totalPrice}\n\nThank you for choosing us!`;
      await sendConfirmationEmail(email, 'Booking Confirmation', bookingMessage);
  
      console.log('Email sent successfully!');
      res.status(200).json({ message: 'Booking confirmed and saved successfully!' });
    } catch (error) {
      console.error('Error confirming booking:', error);
      res.status(500).json({ message: 'An error occurred while processing your booking.', error: error.message });
    }
  });

// Function to send confirmation email
const sendConfirmationEmail = (to, subject, text) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'oengeavheang@gmail.com',
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return reject(error);
      }
      console.log('Email sent successfully:', info);
      resolve(info);
    });
  });
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
