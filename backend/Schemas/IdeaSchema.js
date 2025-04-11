const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: {
    type: String,
    enum: ["Software", "Hardware"], // Only "Software" or "Hardware" allowed
    required: true,
  },
  techStack: {
    type: [String],
    default: undefined,
    validate: {
      validator: function (value) {
        return this.type === "Software" || value.length === 0;
      },
      message: "TechStack should only be provided if type is 'Software'.",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  collaborationReq: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["Accept", "Accepted", "Rejected"],
        default: "Accept",
      },
    },
  ],
  status: {
    type: String,
    enum: ["View", "Under Build", "Looking for Collaborators", "Complete"],
    default: "View",
  },

  likes: { type: Number, default: 0, required: true },
  likedby: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Idea = mongoose.model("Idea", IdeaSchema);
module.exports = Idea;
