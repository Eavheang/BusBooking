const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://oengeavheang:bJv0g3ViAptrC1BH@busbooking.rz5ft.mongodb.net/?retryWrites=true&w=majority&appName=BusBooking'; // Replace with MongoDB URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
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

// Define Review Schema and Model
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'oengeavheang@gmail.com',
    pass: 'nrga ydob qhlg npzv', // Ensure to store this securely
  },
});

// Setup Google Generative AI (Gemini)
const genAI = new GoogleGenerativeAI("AIzaSyABskFszRxdA91a75gXu_MaL8_5rexG4gQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate travel tips using Gemini AI
async function getTravelTips(travelDate, destination) {
  const prompt = `I am traveling to ${destination} on ${travelDate}. Please provide a friendly travel tip for the weather, and suggest places to visit. Use emojis and a polite, friendly tone.`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating travel tips:', error);
    return 'Sorry, we could not fetch travel tips at this time.';
  }
}

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

    // Get travel tips from Gemini AI
    const travelTips = await getTravelTips(travelDate, destination);

    console.log('Booking saved to MongoDB. Attempting to send email...');
    const bookingMessage = `Hello ${firstName} ${lastName},\n\nYour booking has been confirmed.\nFrom: ${origin}\nTo: ${destination}\nTravel Date: ${travelDate}\nTicket Count: ${ticketCount}\nTotal Price: $${totalPrice}\n\nHere are some travel tips for you:\n\n${travelTips}\n\nThank you for choosing us!`;
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
// CRUD Operations for Reviews

// POST: Create a new review
app.post('/api/reviews', async (req, res) => {
  const { name, review, rating } = req.body;

  if (!name || !review || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newReview = new Review({ name, review, rating });
    await newReview.save();
    res.status(201).json({ message: 'Review created successfully!', review: newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'An error occurred while creating the review.', error: error.message });
  }
});

// GET: Retrieve all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    res.status(500).json({ message: 'An error occurred while fetching reviews.', error: error.message });
  }
});

// GET: Retrieve a single review by ID
app.get('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error retrieving review:', error);
    res.status(500).json({ message: 'An error occurred while fetching the review.', error: error.message });
  }
});

// PUT: Update a review by ID
app.put('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const { name, review, rating } = req.body;

  if (!name || !review || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { name, review, rating },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review updated successfully!', review: updatedReview });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'An error occurred while updating the review.', error: error.message });
  }
});

// DELETE: Delete a review by ID
app.delete('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review deleted successfully!', review: deletedReview });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'An error occurred while deleting the review.', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
