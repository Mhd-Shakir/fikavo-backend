const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const contactRoutes = require("./contact");

router.use("/", authRoutes); // /api/admin/login
router.use("/contact", contactRoutes); // /api/admin/contact/messages

module.exports = router;
