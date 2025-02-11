import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MainPage from "./MainPage";
import AuthPage from "./Pages/AuthPage";
import YoursPage from "./Pages/YoursPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/your_ideas" element={<YoursPage />} />
        <Route
          path="/auth"
          element={<AuthPage setShowPopup={() => {}} />}
        />{" "}
      </Routes>
    </div>
  );
}

export default App;
