const express = require("express");
const router = express.Router();
const ClientDetail = require("../models/Contact");
const jwt = require("jsonwebtoken");

// 🔐 Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.admin = admin;
    next();
  });
};

// 📨 Save new contact message
router.post("/", async (req, res) => {
  try {
    const newClient = new ClientDetail(req.body);
    await newClient.save();
    res.status(201).json({ success: true, message: "Message saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔐 Fetch messages (admin only)
router.get("/messages", verifyToken, async (req, res) => {
  try {
    const messages = await ClientDetail.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
