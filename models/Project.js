// Backend/models/Project.js
// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   image: {
//     type: String,
//     required: true, // Cloudinary URL
//   },
//   cloudinary_id: {
//     type: String,
//     required: true, // Cloudinary public_id for deletion
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true // Auto-adds createdAt and updatedAt
// });

// module.exports = mongoose.model('Project', projectSchema);

// Backend/models/Project.js (or wherever your Project model is defined)
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
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

module.exports = mongoose.model('Project', projectSchema);