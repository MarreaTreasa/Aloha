import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const [initial, setInitial] = useState("");

  useEffect(() => {
    console.log("Entering useEff");
    fetch(`${process.env.REACT_APP_API}/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.username) {
          setInitial(data.username.charAt(0).toUpperCase());
        }
      });
  }, [userId]);

  const HandleNavigateAndScroll = (sectionId) => {
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 0);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black p-4 opacity-75">
      <div className="container mx-auto flex justify-between text-white">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Idea Space
        </h1>

        <ul className="flex space-x-6 text-lg items-center">
          <li>
            <button
              className="cursor-pointer hover:underline"
              onClick={() => HandleNavigateAndScroll("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="cursor-pointer hover:underline"
              onClick={() => HandleNavigateAndScroll("ideas")}
            >
              Ideas
            </button>
          </li>
          <li>
            <button
              className="cursor-pointer hover:underline"
              onClick={() => HandleNavigateAndScroll("contact")}
            >
              Contact
            </button>
          </li>
          {initial && (
            <span
              onClick={() => navigate(`/profile/${userId}`)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "red",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
              title="User Profile"
            >
              {initial}
            </span>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
