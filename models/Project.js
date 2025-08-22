// Backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  image: {
    type: String,
    required: true, // Cloudinary URL
  },
  cloudinary_id: {
    type: String,
    required: true, // Cloudinary public_id for deletion
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Auto-adds createdAt and updatedAt
});

module.exports = mongoose.model('Project', projectSchema);