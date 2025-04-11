import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return <div className="text-center text-red-500">No user data found!</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{user.name}</h2>

        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <p className="text-gray-700">
          <strong>Status:</strong> {user.status}
        </p>
        <p className="text-gray-700">
          <strong>About:</strong> {user.about}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {user.email}
        </p>

        {user.github && (
          <p className="text-gray-700">
            <strong>GitHub:</strong>{" "}
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {user.github}
            </a>
          </p>
        )}

        {user.linkedin && (
          <p className="text-gray-700">
            <strong>LinkedIn:</strong>{" "}
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {user.linkedin}
            </a>
          </p>
        )}

        <p className="text-gray-700">
          <strong>Joined:</strong> {new Date(user.createdAt).toDateString()}
        </p>

        {user.skills?.length > 0 && (
          <p className="text-gray-700">
            <strong>Skills:</strong> {user.skills.join(", ")}
          </p>
        )}

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
