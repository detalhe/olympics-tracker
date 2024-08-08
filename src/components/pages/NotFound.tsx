import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className="container mx-auto px-4 text-center">
        <motion.h1 
          variants={itemVariants} 
          className="text-6xl md:text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          404
        </motion.h1>
        <motion.p 
          variants={itemVariants} 
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
        >
          Oops! Page Not Found
        </motion.p>
        <motion.p 
          variants={itemVariants} 
          className="text-lg text-gray-600 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </motion.div>
      </main>
    </motion.div>
  );
}

export default NotFound;