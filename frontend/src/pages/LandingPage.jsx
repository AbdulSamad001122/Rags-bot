import React from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-lg transition-all shadow-lg shadow-blue-500/20"
                >
                  Create Your Bot
                </motion.button>
              </Link>
              <Link to="/showbots">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-gray-700 hover:bg-gray-800 rounded-xl font-medium text-lg transition-all"
                >
                  View Bots
                </motion.button>
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
          {[
            {
              title: "PDF Processing",
              description:
                "Upload any PDF document and our system will extract and process the content for you.",
              icon: "📄",
            },
            {
              title: "AI-Powered Chat",
              description:
                "Interact with your documents through intelligent chatbots powered by advanced AI.",
              icon: "🤖",
            },
            {
              title: "Secure & Private",
              description:
                "Your documents are processed securely and never shared with third parties.",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-4xl w-full bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "Upload PDF",
                description: "Select and upload your document",
              },
              {
                step: "2",
                title: "Processing",
                description: "AI extracts and analyzes content",
              },
              {
                step: "3",
                title: "Create Bot",
                description: "Generate your custom chatbot",
              },
              {
                step: "4",
                title: "Chat",
                description: "Interact with your document",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-lg transition-all shadow-lg shadow-blue-500/20"
              >
                Create Your First Bot
              </motion.button>
            </Link>
          </SignedIn>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} RAGs Bot. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;
