const express = require('express');
const multer = require('multer');
const { getProjects, addProject, deleteProject } = require('../controllers/projectController.js');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", getProjects);
router.post("/", upload.single("image"), addProject);
router.delete("/:id", deleteProject);

module.exports = router;