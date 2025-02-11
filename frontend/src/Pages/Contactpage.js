import { motion } from "framer-motion";

function ContactPage() {
  return (
    <div>
      <section
        id="contact"
        className="min-h-screen bg-purple-500 flex flex-col justify-center items-center p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg mb-6">
            We’d love to hear from you! Whether you have a question about
            features, pricing, or anything else, our team is here to help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-purple-200 text-purple-500 rounded-lg shadow-lg p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Contact Details
          </h2>
          <p className="text-lg mb-4">
            <span className="font-bold">Email:</span> contact@ideaspace.com
          </p>
          <p className="text-lg mb-4">
            <span className="font-bold">Phone:</span> +1 234 567 890
          </p>
          <p className="text-lg mb-4">
            <span className="font-bold">Address:</span> 123 Idea Street,
            Innovation City, IN 56789
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Follow Us on Social Media
          </h2>
          <div className="flex gap-6 justify-center text-purple-500">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition transform duration-300"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition transform duration-300"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition transform duration-300"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition transform duration-300"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default ContactPage;
