// Backend/models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // Still only 3 top-level fields: title, image, date
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);