const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');

// --- Public Contact Submission ---
router.post('/', async (req, res) => {
  const { name, email, message, company } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const contact = new Contact({ name, email, message, company });
    await contact.save();
    res.status(201).json({ success: true, message: "Success" });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// --- Protected: Get All Messages ---
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Use timestamps
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// --- Protected: Delete Single Message ---
router.delete('/messages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

// ✅ --- Protected: Bulk Delete Messages ---
router.post('/messages/deleteMany', authMiddleware, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid or missing IDs" });
  }

  try {
    await Contact.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Messages deleted" });
  } catch (error) {
    console.error("❌ Error deleting messages:", error);
    res.status(500).json({ success: false, error: "Bulk delete failed" });
  }
});

module.exports = router;
