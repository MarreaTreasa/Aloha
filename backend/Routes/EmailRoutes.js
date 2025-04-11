const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/SendEmail");

router.post("/send-invite", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await sendEmail(to, subject, message);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
