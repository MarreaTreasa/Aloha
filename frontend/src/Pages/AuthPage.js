import React, { useState } from "react";

const AuthPage = ({ setShowPopup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      ...(username && !isLogin ? { username } : {}), // send username only on sign up
    };

    const url = isLogin
      ? `${process.env.REACT_APP_API}/api/users/login`
      : `${process.env.REACT_APP_API}/api/users/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("data:", data);

      if (response.ok) {
        setSuccess(data.message || "Request successful");
        setError("");

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user?.userId) {
          localStorage.setItem("userId", data.user.userId);
        }

        if (isLogin) {
          setShowPopup(false);
          // Optionally reload to update Navbar userId from localStorage or use a better state management
          window.location.reload();
        }
      } else {
        setError(data.message || "Something went wrong!");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error");
      setSuccess("");
    }
  };

  const ToggleMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setSuccess("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded-md text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-2 bg-green-200 text-green-800 rounded-md text-center">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-2 mb-3 rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 mb-3 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 mb-3 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={ToggleMode}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </button>
        </div>
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
          aria-label="Close popup"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
