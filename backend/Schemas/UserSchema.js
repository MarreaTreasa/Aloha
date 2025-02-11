const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation regex
    },
    password: {
      type: String,
      required: true,
    },
    ideas: {
      type: Number,
      default: 0, // Default number of ideas submitted by the user
    },
    collabs: {
      type: Number,
      default: 0, // Default number of collaborations
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

const User = mongoose.model("User", UserSchema);
module.exports = User;
