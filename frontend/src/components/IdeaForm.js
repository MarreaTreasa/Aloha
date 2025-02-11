import React, { useState, useEffect } from "react";

function IdeaForm({ onClose, onIdeaAdded, ideaToEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState("view");
  const [type, setType] = useState("Software");

  useEffect(() => {
    if (ideaToEdit) {
      setTitle(ideaToEdit.title);
      setDescription(ideaToEdit.description);
      setCategory(ideaToEdit.category);
      setTechStack(ideaToEdit.techStack);
      setStatus(ideaToEdit.status);
      setType(ideaToEdit.type);
    }
  }, [ideaToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      return console.error("User ID not found in localStorage!");
    }

    const userResponse = await fetch(
      `${process.env.REACT_APP_API}/api/users/${userId}`
    );
    const userData = await userResponse.json();

    if (!userData || !userData.username) {
      return console.error("User data not found!");
    }
    console.log("User found:", userData.username);

    /* const username = userData.username; */
    console.log("Idea to edit :", ideaToEdit);

    const payload = {
      title,
      description,
      category,
      type,
      status,
      ...(type === "Software" ? { techStack } : { techStack: undefined }),
      owner: userId,
      collaborators: [],
    };
    console.log("Payload to be sent:", payload);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ideas/${
          ideaToEdit ? `update/${ideaToEdit._id}` : "add"
        }`,
        {
          method: ideaToEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Data:", data);

      if (response.ok) {
        console.log("Idea added/updated successfully", data);
        onIdeaAdded();
        onClose();
      } else {
        console.log("Error:", data.message);
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error while creating idea:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Add Your Idea
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter a brief description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={!!ideaToEdit}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>

          {/* Show techStack input only if type is Software */}
          {type === "Software" && (
            <div className="mb-4">
              <label
                htmlFor="techStack"
                className="block text-sm font-medium text-gray-700"
              >
                Tech Stack
              </label>
              <input
                type="text"
                id="techStack"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter tech stack (comma separated)"
                value={techStack || ""}
                onChange={(e) => setTechStack(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="View">View</option>
              <option value="Looking for Collaborators">
                Looking for Collaborators
              </option>
              <option value="Under Build">Under Build</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>

        <button className="mt-4 text-blue-500 font-semibold" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default IdeaForm;
