// Backend/routes/projects.js
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Project = require('../models/Project'); // Adjust path as needed
const authMiddleware = require('../middleware/authMiddleware'); // Adjust path as needed

const router = express.Router();

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }]
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// GET /api/projects - Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .select('title image date link createdAt updatedAt');

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// POST /api/projects - Create new project (admin only)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, date, link } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Validate link if provided
    if (link && link.trim()) {
      try {
        new URL(link.trim());
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL'
        });
      }
    }

    // Create project object
    const projectData = {
      title: title.trim(),
      image: req.file.path,
      date: date ? new Date(date) : new Date()
    };

    // Only add link if it's provided
    if (link && link.trim()) {
      projectData.link = link.trim();
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update project (admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, link } = req.body;

    // Find existing project
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Validate link if provided
    if (link && link.trim()) {
      try {
        new URL(link.trim());
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL'
        });
      }
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      date: date ? new Date(date) : existingProject.date
    };

    // Handle link field
    if (link !== undefined) {
      if (link.trim()) {
        updateData.link = link.trim();
      } else {
        // If link is empty string, remove it from the project
        updateData.$unset = { link: 1 };
      }
    }

    // Update image if new one is uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

// GET /api/projects/:id - Get single project (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

module.exports = router;