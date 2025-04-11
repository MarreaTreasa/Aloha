import React, { useEffect, useState } from "react";
import IdeaForm from "../components/IdeaForm";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

function YoursPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState("");
  const [ideaToEdit, setIdeaToEdit] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expandedIdea, setExpandedIdea] = useState(null);
  const [accepted, setAccepted] = useState({});
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const fetchUserDetails = async (senderId) => {
    if (!senderId) return null;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/profile/${senderId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  const viewProfile = async (senderId) => {
    const userData = await fetchUserDetails(senderId);
    if (userData) {
      navigate("/profile-display", { state: { user: userData } });
    }
  };

  const acceptRequest = async (senderId, ideaId) => {
    const receiverDetails = await fetchUserDetails(senderId);

    if (receiverDetails?.email) {
      await sendInvite(receiverDetails.email);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/ideas/update/${ideaId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderId,
              collaborationStatus: "Accepted",
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setAccepted((prev) => ({ ...prev, [ideaId]: true }));
          await fetchIdeas();
          await fetchNotif();
        } else {
          console.error("Failed to update status:", data.error);
        }
      } catch (err) {
        console.error("Error updating idea status:", err);
      }
    }
  };

  const sendInvite = async (email) => {
    try {
      await fetch(`${process.env.REACT_APP_API}/api/email/send-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Collaboration Invitation",
          message: "You have been invited to collaborate on an idea!",
        }),
      });
    } catch (error) {
      console.error("Error sending invite email:", error);
    }
  };

  const fetchIdeas = async () => {
    if (!userId) {
      setError("User ID not found in localStorage!");
      return;
    }

    try {
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

      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error fetching ideas");
      }
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setError("Error while fetching ideas.");
    }
  };

  const fetchNotif = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ideas/${userId}/notifications`
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchIdeas();
      fetchNotif();
    }
  }, [userId]);

  const handleEdit = (idea) => {
    setIdeaToEdit(idea);
    setShowPopup(true);
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    if (!acc[notif.ideaId]) acc[notif.ideaId] = [];
    acc[notif.ideaId].push(notif);
    return acc;
  }, {});

  return (
    <div>
      <section
        id="ideas"
        className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-600 flex flex-col items-center text-white"
      >
        <h1 className="text-4xl font-bold mt-20">Your Ideas</h1>
        <div className="flex w-full max-w-6xl justify-end px-4 mt-6">
          <button
            className="bg-purple-700 hover:bg-purple-800 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md"
            onClick={() => {
              setIdeaToEdit(null);
              setShowPopup(true);
            }}
            title="Add New Idea"
          >
            <FiPlus className="text-3xl" />
          </button>
        </div>

        {error && <p className="text-red-500 text-lg mt-4">{error}</p>}

        {ideas.length === 0 && !error ? (
          <p className="text-lg mt-4">No ideas available currently.</p>
        ) : (
          <div className="grid grid-cols-1 gap-10 p-6 w-full max-w-6xl">
            {ideas.map((idea) => (
              <div
                key={idea._id}
                className="bg-white text-black p-4 rounded-lg shadow-lg relative"
              >
                <MdEdit
                  className="absolute top-3 right-3 text-xl text-gray-600 cursor-pointer"
                  onClick={() => handleEdit(idea)}
                />

                <div className="flex items-center">
                  <h1 className="text-xl font-bold">{idea.title}</h1>
                  <span className="px-3 italic text-md text-violet-600">
                    {idea.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 py-3 ">
                  <span className="flex items-center bg-gray-300 text-black text-sm font-medium px-3 py-1 rounded-full">
                    Category: {idea.category}
                  </span>
                  <span className="flex items-center bg-gray-300 text-black text-sm font-medium px-3 py-1 rounded-full">
                    Type: {idea.type}
                  </span>
                  <span className="flex items-center bg-gray-300 text-black text-sm font-medium px-3 py-1 rounded-full">
                    Tech Stack: {idea.techStack?.join(", ") || "Not defined"}
                  </span>
                  <span className="flex items-center text-black text-lg font-medium py-1 rounded-full">
                    <AiOutlineHeart className="mr-1" />
                    {idea.likes}
                  </span>
                </div>

                <p className="text-lg text-gray-700">{idea.description}</p>

                {groupedNotifications[idea._id] && (
                  <div className="flex justify-end mt-4">
                    <button
                      className="bg-white text-black border-2 border-black px-3 py-1 rounded-md"
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
                  </div>
                )}

                {expandedIdea === idea._id &&
                  groupedNotifications[idea._id] && (
                    <div className="mt-3 bg-gray-200 text-black p-3 rounded-md">
                      <h3 className="font-bold text-lg">
                        Collaboration Requests:
                      </h3>
                      <ul className="list-disc ml-4">
                        {groupedNotifications[idea._id].map((notif) =>
                          notif.senders.map((sender) => (
                            <li
                              key={sender.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <span className="mr-2">Sent by</span>
                                <strong>{sender.username}</strong>
                              </div>
                              <div>
                                <button
                                  className="text-black border-2 border-black bg-white py-1 px-3 rounded-md ml-4 mb-2 "
                                  onClick={() => viewProfile(sender.id)}
                                >
                                  View Profile
                                </button>
                                <button
                                  onClick={() =>
                                    acceptRequest(sender.id, idea._id)
                                  }
                                  disabled={sender.status !== "Accept"}
                                  className={`py-1 px-3 rounded-md ml-4 mb-2 ${
                                    sender.status !== "Accept"
                                      ? "bg-violet-500 text-white"
                                      : "bg-violet-500 text-white"
                                  }`}
                                >
                                  {sender.status}
                                </button>
                              </div>
                            </li>
                          ))
                        )}
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
          ideaToEdit={ideaToEdit}
        />
      )}
    </div>
  );
}

export default YoursPage;
