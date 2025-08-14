const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false, // ✅ Mark unread by default
    },
  },
  {
    timestamps: true, // ✅ Auto-adds createdAt and updatedAt
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
