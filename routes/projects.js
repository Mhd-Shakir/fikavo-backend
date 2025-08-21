const express = require("express");
const { upload } = require("../middleware/upload");
const { createProject, getProjects, deleteProject } = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only
router.post("/", authMiddleware, upload.single("image"), createProject);
router.delete("/:id", authMiddleware, deleteProject);

// Public
router.get("/", getProjects);

module.exports = router;
