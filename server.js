const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://mpl-bice.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/admin');
const galleryRoutes = require('./routes/gallery');
const winnersRoutes = require('./routes/winners');
const sponsorsRoutes = require('./routes/sponsors');
const liveScoresRoutes = require('./routes/liveScores');

app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/winners', winnersRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/live-scores', liveScoresRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'MPL API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});