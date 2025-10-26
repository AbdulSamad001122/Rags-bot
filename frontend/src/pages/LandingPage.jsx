import React from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { SplashCursor } from "@/components/ui/splash-cursor"
import { LiquidGlassDemo } from "@/components/ui/liquid-glass-demo";
import { HoverButton } from "@/components/ui/hover-button";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-black">
      {/* Background elements */}
      <div className="fixed inset-0 z-0">
        <SplashCursor />
      </div>
        
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            RAGs Bot
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Transform your PDF documents into intelligent chatbots with our
            advanced Retrieval-Augmented Generation technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-lg transition-all shadow-lg shadow-blue-500/20"
                >
                  Get Started
                </motion.button>
              </SignInButton>
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-gray-700 hover:bg-gray-800 rounded-xl font-medium text-lg transition-all"
                >
                  Sign Up
                </motion.button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link to="/createbot">
                <HoverButton className="px-8 py-4 text-lg">
                  Create Your Bot
                </HoverButton>
              </Link>
              <Link to="/showbots">
                <HoverButton className="px-8 py-4 text-lg bg-transparent border border-gray-700 hover:bg-gray-800">
                  View Bots
                </HoverButton>
              </Link>
            </SignedIn>
          </motion.div>
        </motion.div>

        {/* Features section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-16"
        >
          <CardSpotlight className="h-80 backdrop-blur-sm bg-black/30">
            <div className="relative z-20">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">PDF Processing</h3>
              <p className="text-gray-400">
                Upload any PDF document and our system will extract and process the content for you.
              </p>
            </div>
          </CardSpotlight>
          
          <CardSpotlight className="h-80 backdrop-blur-sm bg-black/30">
            <div className="relative z-20">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Chat</h3>
              <p className="text-gray-400">
                Interact with your documents through intelligent chatbots powered by advanced AI.
              </p>
            </div>
          </CardSpotlight>
          
          <CardSpotlight className="h-80 backdrop-blur-sm bg-black/30">
            <div className="relative z-20">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Your documents are processed securely and never shared with third parties.
              </p>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Demo section */}
        <div className="w-full mb-16 flex justify-center">
          <LiquidGlassDemo 
            className="max-w-6xl w-full" 
            bgColor="rgba(0, 9, 65, 0.8)" // Example: Light blue with transparency
          />
        </div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Documents?
          </h2>
          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-lg transition-all shadow-lg shadow-blue-500/20"
              >
                Start Creating Bots
              </motion.button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/createbot">
              <HoverButton className="px-8 py-4 text-lg">
                Create Your First Bot
              </HoverButton>
            </Link>
          </SignedIn>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-gray-500 text-sm backdrop-blur-sm bg-black/30">
        © {new Date().getFullYear()} RAGs Bot. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;