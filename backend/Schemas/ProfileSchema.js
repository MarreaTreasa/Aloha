const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    profilePicture: { type: String }, // Store image URL
    email: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    about: { type: String },
    skills: { type: [String] },
    linkedin: { type: String },
    github: { type: String },
    isLocked: { type: Boolean, default: false }, // True means private profile
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
