import React, { useEffect, useState } from "react";
import IdeaForm from "../components/IdeaForm";

function YoursPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState("");
  const [ideaToEdit, setIdeaToEdit] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expandedIdea, setExpandedIdea] = useState(null);

  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
  console.log("User ID fetched from localStorage:", userId);

  const fetchIdeas = async () => {
    if (!userId) {
      setError("User ID not found in localStorage!");
      return;
    }

    try {
      console.log("Fetching ideas...");
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ideas/print`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user": userId,
          },
        }
      );

      const contentType = response.headers.get("Content-Type");
      console.log("Response Content-Type:", contentType);

      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
        setError("");
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || errorData.message || "Error fetching ideas"
        );
        console.error("Error fetching ideas:", errorData);
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setError("Error while fetching ideas.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchIdeas();
    }
    console.log("Moving into the useeffect");
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotif();
    }
  }, [userId]);

  const handleEdit = (idea) => {
    setIdeaToEdit(idea);
    setShowPopup(true);
  };

  const groupedNotifications = Array.isArray(notifications)
    ? notifications.reduce((acc, notif) => {
        acc[notif.ideaId] = acc[notif.ideaId];
        acc[notif.ideaId] = acc[notif.ideaId] || [];
        acc[notif.ideaId].push(notif);
        return acc;
      }, {})
    : {};

  const fetchNotif = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ideas/${userId}/notifications`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data @ latest...", data);
        if (data.notifications && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      } else {
        console.log("Failed to fetch notifications");
        setNotifications([]);
      }
    } catch (error) {
      console.log("Error fetching:", error);
      setNotifications([]);
    }
  };

  return (
    <div>
      <section
        id="ideas"
        className="min-h-screen bg-orange-500 flex flex-col items-center text-white"
      >
        <h1 className="text-4xl font-bold mt-20">Your Ideas</h1>
        <div className="flex w-full max-w-6xl justify-end px-4 mt-6">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => (setIdeaToEdit(null), setShowPopup(true))}
          >
            Add New
          </button>
        </div>

        {error && <p className="text-red-500 text-lg mt-4">{error}</p>}

        {ideas.length === 0 && !error ? (
          <p className="text-lg mt-4">No ideas available currently.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 p-6 w-full max-w-6xl">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="bg-white text-black p-4 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <h1 className="text-xl font-bold">{idea.title}</h1>
                  <span>❤️ {idea.likes}</span>
                </div>
                <p className="text-lg text-gray-700">{idea.description}</p>
                <p className="text-lg font-semibold text-gray-600">
                  Category: {idea.category}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  Type: {idea.type}
                </p>
                <p className="text-gray-600">
                  Tech Stack: {idea.techStack?.join(", ") || "Not defined"}
                </p>
                <div className="flex justify-between w-full h-8 mt-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(idea)}
                      className="bg-yellow-500 text-white py-1 px-4 rounded-md "
                    >
                      Edit
                    </button>
                    <span className="bg-green-400 text-white px-3 py-1 rounded-md">
                      {idea.status}
                    </span>
                  </div>
                </div>

                {/* Incoming Requests Button */}
                {groupedNotifications[idea._id] && (
                  <button
                    className="mt-3 bg-blue-400 text-white px-3 py-1 rounded-md w-full"
                    onClick={() =>
                      setExpandedIdea(
                        expandedIdea === idea._id ? null : idea._id
                      )
                    }
                  >
                    {expandedIdea === idea._id
                      ? "Hide Requests"
                      : "Incoming Requests"}
                  </button>
                )}
                {/* Incoming Requests Box */}
                {expandedIdea === idea._id &&
                  groupedNotifications[idea._id] && (
                    <div className="mt-2 bg-gray-200 text-black p-3 rounded-md">
                      <h3 className="font-bold text-lg">
                        Collaboration Requests:
                      </h3>
                      <ul className="list-disc ml-4">
                        {groupedNotifications[idea._id].map((notif, index) => (
                          <li key={index}>
                            Sent by{" "}
                            <strong>{notif.senderIds.join(", ")}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </section>

      {showPopup && (
        <IdeaForm
          onClose={() => setShowPopup(false)}
          onIdeaAdded={fetchIdeas}
          ideaToEdit={ideaToEdit || null}
        />
      )}
    </div>
  );
}

export default YoursPage;
