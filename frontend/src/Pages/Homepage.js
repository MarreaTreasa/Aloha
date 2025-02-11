import { motion } from "framer-motion";

const Homepage = () => {
  return (
    <div>
      <section
        id="home"
        className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500"
      >
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold">Welcome to Idea Space</h1>
          <p className="text-xl mt-4">
            Your gateway to innovative ideas and collaboration
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Homepage;
