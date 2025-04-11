import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState(null);
  const [collabpopup, setcollabpopup] = useState(null);
  const userId = localStorage.getItem("userId");

  const statuscolors = {
    "View": "bg-green-500",
    "Looking for Collaborators": "bg-yellow-500",
    "Complete": "bg-gray-500",
    "Under Build": "bg-blue-500",
  };

  const HandleCollabReq = async (ideaId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ideas/${ideaId}/request-collaboration`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: userId }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        alert("Collaboration request sent successfully", data);
        setcollabpopup(null);
      } else {
        const err = await response.json();
        alert("Error sending request", err);
        alert(err.error || "Failed to send request");
      }
    } catch (error) {
      console.log("Error 3.14:", error);
    }
  };

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/ideas/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch idea details...");
        }
        const idea = await response.json();
        setIdea(idea);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchIdeaDetails();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!idea) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">{idea.title}</h1>
        <span className="text-red-500 mt-4">❤️ {idea.likes}</span>
        <p className="text-lg text-gray-700 mb-2">{idea.description}</p>
        <p className="text-lg font-semibold">Category: {idea.category}</p>
        <p className="text-lg font-semibold">Type: {idea.type}</p>
        <p className="text-lg">
          Tech Stack: {idea.techStack?.join(", ") || "None"}
        </p>
        <div className="flex justify-between items-center h-10 mt-4">
          <button
            onClick={() => {
              if (idea.status === "Looking for Collaborators") {
                console.log("Popup Idea:", idea);
                setcollabpopup(idea);
              }
            }}
            className={`${
              statuscolors[idea.status] || "bg-gray-200"
            } text-white px-4 py-2 rounded-md text-md`}
          >
            {idea.status}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Back
          </button>
        </div>
        {collabpopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl text-black font-bold">
                Title: {collabpopup.title}
              </h2>
              <p className="text-gray-600">
                Description: {collabpopup.description}
              </p>
              <p className="text-gray-600">
                Collaborators: {collabpopup.collaborators?.join(",") || "None"}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setcollabpopup(null)}
                  className="bg-blue-500 py-2 px-4 rounded-lg text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => HandleCollabReq(collabpopup._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Confirm request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IdeaDetailPage;
