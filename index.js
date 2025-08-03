require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const contactRouter = require('./routes/contact'); // Handles contact + admin message fetch
const authRouter = require('./routes/auth');       // Handles admin login

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow requests from frontend URL
}));

// Routes
app.use('/api/contact', contactRouter); // POST / (public), GET /messages (admin)
app.use('/api/contact', authRouter);    // POST /login (admin login route)

// OR (if using /api/admin path style)
// app.use('/api/admin', require('./routes/admin'));


// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
