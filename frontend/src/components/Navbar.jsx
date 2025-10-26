import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-800 relative z-50">
      {/* Left side: App name / Home */}
      <div className="font-bold text-xl">
        <Link
          to="/"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          RAGs Bot
        </Link>
      </div>

      {/* Right side: Authentication buttons / user profile */}
      <div className="flex gap-4 items-center">
        {/* Show when user is signed out */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-transparent border border-gray-700 hover:bg-gray-800 rounded-lg font-medium transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        {/* Show when user is signed in */}
        <SignedIn>
          {!isLandingPage && (
            <>
              <Link
                to="/createbot"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Create Bot
              </Link>
              <Link
                to="/showbots"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                My Bots
              </Link>
            </>
          )}
          <UserButton /> {/* Clerk's ready-made profile button */}
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;