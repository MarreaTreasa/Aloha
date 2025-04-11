import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./MainPage";
import AuthPage from "./Pages/AuthPage";
import YoursPage from "./Pages/YoursPage";
import IdeaDetailPage from "./Pages/IdeaDetail";
import ProfilePage from "./Pages/ProfilePage";
import ProfileDisplay from "./components/ProfileDisplay";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/your_ideas" element={<YoursPage />} />
        <Route path="/idea/:id" element={<IdeaDetailPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/profile-display" element={<ProfileDisplay />} />
        <Route
          path="/auth"
          element={<AuthPage setShowPopup={() => {}} />}
        />{" "}
      </Routes>
    </div>
  );
}

export default App;
