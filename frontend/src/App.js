import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./MainPage";
import AuthPage from "./Pages/AuthPage";
import YoursPage from "./Pages/YoursPage";
import IdeaDetailPage from "./Pages/IdeaDetail";
import ProfilePage from "./Pages/ProfilePage";
import ProfileDisplay from "./components/ProfileDisplay";

function App() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="App">
      <Navbar setShowPopup={setShowPopup} />
      
      {/* Render AuthPage popup on top of everything when triggered */}
      {showPopup && <AuthPage setShowPopup={setShowPopup} />}
      
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/your_ideas" element={<YoursPage />} />
        <Route path="/idea/:id" element={<IdeaDetailPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/profile-display" element={<ProfileDisplay />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
