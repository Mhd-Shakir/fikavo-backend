// POST create new project (admin only) - ENHANCED WITH DEBUG LOGGING
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  console.log('🚀 === PROJECT CREATION DEBUG START ===');
  
  try {
    // Log incoming request details
    console.log('📥 Request body:', req.body);
    console.log('📁 File info:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      public_id: req.file.public_id
    } : 'NO FILE');
    
    const { title, date } = req.body;
    console.log('📝 Extracted data:', { title, date });

    // Validate required fields
    if (!title || !req.file) {
      console.log('❌ Validation failed:', { title: !!title, file: !!req.file });
      return res.status(400).json({ 
        success: false, 
        message: 'Title and image are required' 
      });
    }

    console.log('✅ Validation passed, creating project...');

    // Create new project
    const projectData = {
      title: title.trim(),
      image: req.file.path, // Cloudinary URL
      cloudinary_id: req.file.public_id, // For deletion
      date: date || new Date()
    };
    
    console.log('📦 Project data to save:', projectData);
    
    const newProject = new Project(projectData);
    console.log('🆕 New project instance created');

    await newProject.save();
    console.log('💾 Project saved to database successfully');

    console.log('🎉 === PROJECT CREATION SUCCESS ===');
    res.status(201).json({ 
      success: true, 
      message: 'Project created successfully',
      project: newProject
    });

  } catch (error) {
    console.log('🔥 === ERROR OCCURRED ===');
    console.error('Full error object:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check specific error types
    if (error.name === 'ValidationError') {
      console.log('📋 Mongoose validation error details:', error.errors);
    }
    
    if (error.code) {
      console.log('🔢 Error code:', error.code);
    }
    
    // If project creation fails but image was uploaded, clean up Cloudinary
    if (req.file && req.file.public_id) {
      console.log('🧹 Cleaning up uploaded image:', req.file.public_id);
      try {
        await cloudinary.uploader.destroy(req.file.public_id);
        console.log('✅ Image cleanup successful');
      } catch (cleanupError) {
        console.error('❌ Error cleaning up image:', cleanupError);
      }
    }

    console.log('🔥 === ERROR DEBUG END ===');
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create project',
      // Include error details in development
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack 
      })
    });
  }
});