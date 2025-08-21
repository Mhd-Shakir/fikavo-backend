const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Configure multer storage with cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fikavo_projects", // folder in cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// @POST Upload project
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file?.path) {
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    res.json({
      success: true,
      message: "Project uploaded successfully",
      project: {
        title,
        description,
        imageUrl: req.file.path, // Cloudinary image URL
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
