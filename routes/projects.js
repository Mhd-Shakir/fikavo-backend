// Backend/routes/projects.js
const express = require('express');
const router = express.Router();
const streamifier = require('streamifier');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const Project = require('../models/project');

// Use the same admin-protect middleware you already use on admin routes
const auth = require('../middleware/authMiddleware'); // adjust import if name differs

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'projects' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// Create
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const result = await uploadToCloudinary(req.file.buffer);

    const project = await Project.create({
      title,
      image: { url: result.secure_url, publicId: result.public_id },
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(project);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Upload failed', error: e.message });
  }
});

// List
router.get('/', async (_req, res) => {
  const items = await Project.find().sort({ date: -1, createdAt: -1 });
  res.json(items);
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.image?.publicId) {
      await cloudinary.uploader.destroy(project.image.publicId);
    }

    await project.deleteOne();
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Delete failed', error: e.message });
  }
});

module.exports = router;