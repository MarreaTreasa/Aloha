import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function App() {
  return (
    <div>
      <section className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex flex-col justify-center items-center px-6 py-16 text-white">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl w-full max-w-6xl flex flex-col md:flex-row gap-8"
        >
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
              alt="Modern office space"
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-semibold">Get in Touch</h2>
            <p className="text-lg opacity-90">
              We're here to help! Whether you have a question about our
              services, want to collaborate, or just want to say hello, we'd
              love to hear from you.
            </p>
            <div className="space-y-4">
              <p className="flex items-center gap-2">
                <span className="font-semibold">Email:</span>
                contact@ideaspace.com
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Phone:</span>
                +1 234 567 890
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">Address:</span>
                123 Idea Street, Innovation City, IN 56789
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
          <div className="flex gap-6 justify-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-white/20 transition-transform duration-300 hover:scale-110"
            >
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-white/20 transition-transform duration-300 hover:scale-110"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-white/20 transition-transform duration-300 hover:scale-110"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-white/20 transition-transform duration-300 hover:scale-110"
            >
              <FaLinkedinIn className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default App;
