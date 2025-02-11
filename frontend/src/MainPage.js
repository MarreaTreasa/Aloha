import React, { useState, useEffect } from "react";
import AuthPage from "./Pages/AuthPage"; // Import the AuthPage component
import HomePage from "./Pages/Homepage";
import IdeaPage from "./Pages/Ideapage";
import ContactPage from "./Pages/Contactpage";

const MainPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Show the AuthPage popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true); // Show the popup after 3 seconds
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Main content sections */}
      <section id="home">
        <HomePage />
      </section>
      <section id="ideas">
        <IdeaPage />
      </section>
      <section id="contact">
        <ContactPage />
      </section>

      {/* Render the AuthPage as a popup after 3 seconds */}
      {showPopup && <AuthPage setShowPopup={setShowPopup} />}
    </div>
  );
};

export default MainPage;
