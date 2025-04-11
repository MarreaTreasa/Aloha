const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Profile = require("../Schemas/ProfileSchema");

const router = express.Router();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set Storage Engine
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Configure Multer with File Size Limit and Format Filtering
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images (JPEG, PNG, GIF) are allowed!"));
    }
  },
});

// Add or Update Profile
router.post("/update", upload.single("profilePicture"), async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);

    const {
      userId,
      name,
      email,
      linkedin,
      status,
      github,
      about,
      skills,
      isLocked,
    } = req.body;

    if (!userId || !name || !email) {
      return res
        .status(400)
        .json({ error: "User ID, Name, and Email are required." });
    }

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      {
        name,
        email,
        linkedin,
        status,
        github,
        about,
        skills,
        profilePicture,
        isLocked,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get Profile by ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    if (profile.isLocked) {
      return res.status(403).json({ error: "This profile is private." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;
