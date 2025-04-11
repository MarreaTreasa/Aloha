const express = require("express");
const router = express.Router();
const Idea = require("../Schemas/IdeaSchema");

router.post("/add", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      techStack,
      owner,
      collaborators,
    } = req.body;

    // Check if required fields are present
    if (!title || !description || !category || !type || !owner) {
      return res.status(400).json({ error: "All fields are required..." });
    }

    let processedTechStack = [];
    if (type === "Software") {
      if (techStack && techStack.length > 0) {
        processedTechStack = techStack.split(",").map((item) => item.trim());
      } else {
        processedTechStack = ["Any"];
      }
    }

    // For hardware, skip techStack completely
    const newIdea = new Idea({
      title,
      description,
      category,
      type,
      techStack: type === "Hardware" ? undefined : processedTechStack,
      owner,
      collaborators: collaborators || [],
    });

    await newIdea.save();
    res
      .status(201)
      .json({ message: "Idea created successfully", idea: newIdea });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/print", async (req, res) => {
  try {
    const userId = req.headers["x-user"];
    let filter = {};

    if (userId) {
      filter.owner = userId;
    }
    const ideas = await Idea.find(filter).sort(
      { likes: -1 }).populate("owner", "username");
    console.log("Ideas from IdeasList:", ideas);

    if (ideas.length === 0) {
      return res.status(404).json({ message: "No ideas found for this user." });
    }

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error fetching ideas from:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      type,
      techStack,
      collaborators,
      status,
      senderId,
      collaborationStatus,
    } = req.body;

    if (
      !title &&
      !category &&
      !type &&
      !techStack &&
      !collaborators &&
      !status &&
      !senderId &&
      !collaborationStatus
    ) {
      return res
        .status(400)
        .json({ error: "At least one field is required for update" });
    }

    let updateFields = {};

    if (title) updateFields.title = title;
    if (category) updateFields.category = category;
    if (type) updateFields.type = type;
    if (collaborators) updateFields.collaborators = collaborators;

    // Validate status if provided
    const allowedStatuses = [
      "View",
      "Under Build",
      "Looking for Collaborators",
      "Complete",
    ];
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status value. Must be one of: ${allowedStatuses.join(
            ", "
          )}`,
        });
      }
      updateFields.status = status;
    }

    if (techStack) {
      if (typeof techStack === "string") {
        updateFields.techStack = techStack
          .split(",")
          .map((item) => item.trim());
      }
    } else if (type === "Hardware") {
      updateFields.$unset = { techStack: "" };
    }

    const updatedIdea = await Idea.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedIdea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    // Handle collaboration request update
    if (senderId && collaborationStatus) {
      const collabRequest = updatedIdea.collaborationReq.find(
        (req) => req.senderId.toString() === senderId
      );

      if (collabRequest) {
        // Validate status for collaborationReq
        const validStatuses = ["Accept", "Accepted", "Rejected"];
        if (!validStatuses.includes(collaborationStatus)) {
          return res.status(400).json({
            error: `Invalid collaborationStatus. Must be one of: ${validStatuses.join(
              ", "
            )}`,
          });
        }

        collabRequest.status = collaborationStatus;
        await updatedIdea.save(); // <-- this line triggers full schema validation
      } else {
        return res.status(404).json({
          error: "Collaboration request not found for this senderId",
        });
      }
    }

    res
      .status(200)
      .json({ message: "Idea updated successfully", idea: updatedIdea });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

//Likes patch
router.patch("/:id/likes", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: "UserId required" });
    }
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }
    if (idea.likedby.includes(userId)) {
      return res.status(404).json({ error: "Idea already liked by user" });
    }
    idea.likedby.push(userId);
    idea.likes += 1;
    await idea.save();

    res.json({ message: "Likes updated successfully", likes: idea.likes });
  } catch {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Collaboration req
router.post("/:id/request-collaboration", async (req, res) => {
  const { id } = req.params;
  const { senderId } = req.body;
  if (!senderId) {
    return res.status(400).json({ error: "Sender ID required" });
  }
  const idea = await Idea.findById(id);
  if (!idea) {
    return res.status(400).json({ error: "Idea not found" });
  }
  idea.collaborationReq.push({ senderId });
  await idea.save();
  res
    .status(200)
    .json({ message: "Collaboration request sent successfully..." });
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    res.status(200).json(idea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.get("/:userId/notifications", async (req, res) => {
  try {
    const { userId } = req.params;
    const ideas = await Idea.find({ owner: userId }).populate(
      "collaborationReq.senderId",
      "username"
    );

    if (ideas.length === 0) {
      return res.status(404).json({ message: "No ideas found for this user." });
    }

    const notifications = ideas
      .filter((idea) => idea.collaborationReq.length > 0)
      .map((idea) => ({
        ideaId: idea._id,
        title: idea.title,
        senders: idea.collaborationReq.map((req) => ({
          id: req.senderId._id,
          username: req.senderId.username,
          status: req.status,
        })),
      }));

    if (notifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No collaboration requests found." });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:ideaId/accept-collaboration/:requestId", async (req, res) => {
  try {
    const { ideaId, requestId } = req.params;

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }

    const request = idea.collaborationReq.find(
      (req) => req._id.toString() === requestId
    );

    if (!request) {
      return res.status(404).json({ error: "Collaboration request not found" });
    }

    if (request.status === "Accepted") {
      return res
        .status(400)
        .json({ error: "Request has already been accepted" });
    }

    request.status = "Accepted";
    await idea.save();

    res
      .status(200)
      .json({ message: "Collaboration request accepted successfully", idea });
  } catch (error) {
    console.error("Error updating collaboration status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
