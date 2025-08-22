// Backend/routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect admin routes
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// GET all projects (public route)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ date: -1 });
    res.status(200).json({ 
      success: true, 
      projects,
      count: projects.length 
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch projects' 
    });
  }
});

// POST create new project (admin only)
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, date } = req.body;

    // Validate required fields
    if (!title || !req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and image are required' 
      });
    }

    // Create new project
    const newProject = new Project({
      title: title.trim(),
      image: req.file.path, // Cloudinary URL
      cloudinary_id: req.file.public_id, // For deletion
      date: date || new Date()
    });

    await newProject.save();

    res.status(201).json({ 
      success: true, 
      message: 'Project created successfully',
      project: newProject
    });

  } catch (error) {
    console.error('Error creating project:', error);
    
    // If project creation fails but image was uploaded, clean up Cloudinary
    if (req.file && req.file.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id);
      } catch (cleanupError) {
        console.error('Error cleaning up image:', cleanupError);
      }
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to create project' 
    });
  }
});

// PUT update project (admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Update project data
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (date) updateData.date = date;

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (project.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(project.cloudinary_id);
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }
      }
      
      updateData.image = req.file.path;
      updateData.cloudinary_id = req.file.public_id;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    
    // Clean up new image if update fails
    if (req.file && req.file.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id);
      } catch (cleanupError) {
        console.error('Error cleaning up new image:', cleanupError);
      }
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to update project' 
    });
  }
});

// DELETE project (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Delete image from Cloudinary
    if (project.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(project.cloudinary_id);
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError);
      }
    }

    // Delete project from database
    await Project.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete project' 
    });
  }
});

// Bulk delete projects (admin only)
router.post('/bulk-delete', verifyAdmin, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project IDs are required' 
      });
    }

    // Get projects to delete (for Cloudinary cleanup)
    const projects = await Project.find({ _id: { $in: ids } });

    // Delete images from Cloudinary
    const deletePromises = projects.map(project => {
      if (project.cloudinary_id) {
        return cloudinary.uploader.destroy(project.cloudinary_id);
      }
    });

    try {
      await Promise.all(deletePromises);
    } catch (deleteError) {
      console.error('Error deleting some images from Cloudinary:', deleteError);
    }

    // Delete projects from database
    await Project.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ 
      success: true, 
      message: `${projects.length} projects deleted successfully` 
    });

  } catch (error) {
    console.error('Error bulk deleting projects:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete projects' 
    });
  }
});

module.exports = router;