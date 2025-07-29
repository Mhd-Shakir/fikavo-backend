const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables early

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middlewares ---
app.use(cors({
  origin: ['FORNTEND_URL'], // ✅ Allow only your frontend domain
  credentials: true,
}));
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

app.use('/api/contact', contactRoutes);       // Handles contact form (POST, GET, DELETE)
app.use('/api/admin', adminRoutes);           // Handles admin login (POST /login)

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
