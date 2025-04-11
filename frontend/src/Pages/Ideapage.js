import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi"; // Outlined heart

function IdeaPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleViewYourIdeas = () => {
    navigate("/your_ideas");
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
        const { likes, likedby } = await response.json();

        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea._id === ideaID ? { ...idea, likes, likedby } : idea
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
        className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex flex-col items-center text-white"
      >
        <div>
          <h1 className="text-4xl font-bold mt-20">Ideas</h1>

          {ideas.length === 0 && !error ? (
            <p className="text-lg mt-4">No ideas available currently.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-6 w-full max-w-6xl">
              {ideas.map((idea) => {
                const hasLiked = idea.likedby?.includes(userId);
                return (
                  <div
                    key={idea._id}
                    onClick={() => navigate(`/idea/${idea._id}`)}
                    className="bg-white text-black p-4 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <h1 className="text-xl font-bold">{idea.title}</h1>
                    <p className=" text-violet-500 text-sm font-medium px-3 py-1 rounded-full italic mb-1">
                      By {idea.owner?.username || "Unknown"}
                    </p>
                    <p className="text-lg text-gray-700">{idea.description}</p>

                    <div className="flex justify-between mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          HandleLikes(idea._id);
                        }}
                        className="text-black rounded-full px-3 py-1 flex items-center gap-2 hover:bg-gray-100"
                      >
                        {hasLiked ? (
                          <FaHeart className="text-black text-sm" />
                        ) : (
                          <FiHeart className="text-black text-sm" />
                        )}
                        {idea.likes}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center flex-grow mb-10">
          <button
            onClick={handleViewYourIdeas}
            className="bg-white text-black border-black border-2 p-4 shadow-lg relative py-2 px-4 rounded-md flex items-center"
          >
            View Your Ideas
          </button>
        </div>
      </section>
    </div>
  );
}

export default IdeaPage;
