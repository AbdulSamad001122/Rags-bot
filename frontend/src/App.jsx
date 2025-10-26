import { Routes, Route, Link } from "react-router-dom";
import CreateBot from "./pages/CreateBot";
import Chat from "./pages/Chat";
import ShowBots from "./pages/ShowBots";
import LandingPage from "./pages/LandingPage";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div>
        {/* Global Navbar */}
        <Navbar />
        
        {/* Define All Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/createbot" element={<CreateBot />} />
          <Route path="/chat/:botName" element={<Chat />} />
          {/* 👈 dynamic route */}
          <Route path="/showbots" element={<ShowBots />} />
        </Routes>
      </div>
    </>
  );
}

export default App;