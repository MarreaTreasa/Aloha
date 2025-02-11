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
      ...(username && { username }),
    };

    const url = isLogin
      ? `${process.env.REACT_APP_API}/api/users/login`
      : `${process.env.REACT_APP_API}/api/users/register`;
    const method = "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("data:", data);

      if (response.ok) {
        setSuccess(data.message || "Request Successful");
        setError("");

        if (isLogin) {
          setShowPopup(false); // Close the popup on successful login

          localStorage.setItem("userId", data.user.userId);
          console.log("User id set from AuthPage:", data.user.userId);
        }
      } else {
        setError(data.error || "Something went wrong!");
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
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={ToggleMode}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
