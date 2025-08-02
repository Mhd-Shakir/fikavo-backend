const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// --- CORS Setup ---
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., 'https://fikavo.vercel.app'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// --- Body Parser ---
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('Hello from the Fikavo Backend!');
});

// --- Routes ---
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

app.use('/api/contact', contactRoutes); // Protected: requires token
app.use('/api/admin', adminRoutes);     // Login route: issues token

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
