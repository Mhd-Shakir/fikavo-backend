import express from "express";
import multer from "multer";
import { getProjects, addProject, deleteProject } from "../controllers/projectController.js";

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

export default router;
