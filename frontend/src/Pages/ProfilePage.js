import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    status: "",
    linkedin: "",
    github: "",
    about: "",
    skills: "",
    profilePicture: "",
    isLocked: false,
  });

  // Handle Profile Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("status", profile.status);
    formData.append("linkedin", profile.linkedin);
    formData.append("github", profile.github);
    formData.append("about", profile.about);
    formData.append("skills", profile.skills);
    formData.append("isLocked", profile.isLocked);

    if (profile.profilePicture instanceof File) {
      formData.append("profilePicture", profile.profilePicture);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/profile/${userId}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePicture: file });
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-700 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full h-[500px] overflow-y-auto bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Edit Your Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="profilePictureUpload" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center bg-gray-200">
              {profile.profilePicture instanceof File ? (
                <img
                  src={URL.createObjectURL(profile.profilePicture)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Upload</span>
              )}
            </div>
          </label>
          <input
            id="profilePictureUpload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-[500px] mx-auto space-y-4 bg-white p-6 shadow-md rounded-lg"
          >
            <label className="block text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="status"
              value={profile.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            <label className="block text-gray-700">
              About <span className="text-red-500">*</span>
            </label>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>

            <label className="block text-gray-700">Skills</label>
            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <label className="block text-gray-700">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <label className="block text-gray-700">GitHub</label>
            <input
              type="text"
              name="github"
              value={profile.github}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isLocked"
                checked={profile.isLocked}
                onChange={() =>
                  setProfile({ ...profile, isLocked: !profile.isLocked })
                }
              />
              <span>Make Profile Private</span>
            </label>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
