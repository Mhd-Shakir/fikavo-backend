const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  link: {
    type: String,
    required: false, // Optional field
    trim: true,
    validate: {
      validator: function(v) {
        // Only validate if link is provided
        if (!v) return true;
        try {
          new URL(v);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['websites', 'video-editing', 'graphic-design', 'branding'],
    default: 'websites'
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

module.exports = mongoose.model('Project', projectSchema);