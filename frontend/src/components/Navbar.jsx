import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
