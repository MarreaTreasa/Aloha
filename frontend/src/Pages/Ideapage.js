import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function IdeaPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState(null);
  const [collabpopup, setcollabpopup] = useState(null);
  const userId = localStorage.getItem("userId");

  const statuscolors = {
    View: "bg-green-500",
    "Looking for Collaborators": "bg-yellow-500",
    Completed: "bg-red-500",
    "Under Build": "bg-blue-500",
  };

  const handleViewYourIdeas = () => {
    navigate("/your_ideas");
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

  const HandleLikes = async (ideaID) => {
    console.log("Entering HandleLikes...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/ideas/${ideaID}/likes`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (response.ok) {
        const { likes } = await response.json();

        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea._id === ideaID ? { ...idea, likes } : idea
          )
        );
      } else {
        const errorData = await response.json();
        setError(errorData.error || errorData.message || "Error liking idea");
        console.error("Error liking idea:", errorData);
      }
    } catch (error) {
      console.error("Error liking idea:", error);
      setError("Error while liking idea.");
    }
  };

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/ideas/print`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }
        const data = await response.json();
        setIdeas(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchIdeas();
  }, []);

  return (
    <div>
      <section
        id="ideas"
        className="min-h-screen bg-green-300 flex flex-col items-center text-white"
      >
        <div>
          <h1 className="text-4xl font-bold mt-20">Ideas</h1>

          {ideas.length === 0 && !error ? (
            <p className="text-lg mt-4">No ideas available currently.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-6 w-full max-w-6xl">
              {ideas.map((idea) => (
                <div
                  key={idea._id}
                  className="bg-white text-black p-4 rounded-lg shadow-lg"
                >
                  <h1 className="text-xl font-bold">{idea.title}</h1>
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
                        onClick={() => {
                          if (idea.status === "Looking for Collaborators") {
                            console.log("Popup Idea:", idea);
                            setcollabpopup(idea);
                          }
                        }}
                        className={`${
                          statuscolors[idea.status] || "bg - gray - 200"
                        } text-white px-3 py-1 rounded-md`}
                      >
                        {idea.status}
                      </button>
                    </div>
                    <button
                      onClick={() => HandleLikes(idea._id)}
                      className="text-red-500"
                    >
                      ❤️ {idea.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <button
            onClick={handleViewYourIdeas}
            className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center"
          >
            View Your Ideas
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
      </section>
    </div>
  );
}

export default IdeaPage;
