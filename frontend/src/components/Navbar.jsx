import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar({ setShowPopup }) {
  const navigate = useNavigate();
  const location = useLocation();
  const storedUserId = localStorage.getItem("userId");
  const [userId, setUserId] = useState(storedUserId);
  const [initial, setInitial] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setInitial("U"); // Default gray U when logged out
      return;
    }

    fetch(`${process.env.REACT_APP_API}/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.username) {
          setInitial(data.username.charAt(0).toUpperCase());
        }
      });
  }, [userId]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserId(null);
    setDropdownOpen(false);
    navigate("/"); // Optional: redirect after logout
  };

  const handleLogin = () => {
    setDropdownOpen(false);
    setShowPopup(true); // Show login popup instead of navigation
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black p-4 opacity-75 z-50">
      <div className="container mx-auto flex justify-between text-white relative">
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

          <li className="relative" ref={dropdownRef}>
            <span
              onClick={() => setDropdownOpen((prev) => !prev)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: userId ? "red" : "gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white",
                textTransform: "uppercase",
                cursor: "pointer",
                userSelect: "none",
              }}
              title={userId ? "User Profile" : "Login"}
            >
              {initial || "U"}
            </span>

            {dropdownOpen && (
              <ul
                style={{
                  position: "absolute",
                  top: "45px",
                  right: 0,
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  listStyle: "none",
                  padding: "5px 0",
                  minWidth: "150px",
                  zIndex: 1000,
                }}
              >
                {userId ? (
                  <>
                    <li
                      style={{
                        padding: "8px 15px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onClick={() => {
                        navigate(`/profile/${userId}`);
                        setDropdownOpen(false);
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && navigate(`/profile/${userId}`)
                      }
                      tabIndex={0}
                    >
                      View Profile
                    </li>
                    <li
                      style={{
                        padding: "8px 15px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                      onClick={handleLogout}
                      onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                      tabIndex={0}
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  <li
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={handleLogin}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    tabIndex={0}
                  >
                    Login
                  </li>
                )}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
