import { Home, Medal, BarChart3, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-700 rounded-md" : "";
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <header className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <motion.div 
            className="text-2xl font-bold italic lowercase cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            olympics-tracker
          </motion.div>
        </Link>
        <div className="flex items-center">
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {['/', '/medals', '/stats'].map((path, index) => (
                <motion.li key={path} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Link to={path} className={`hover:text-blue-400 p-2 inline-flex items-center ${isActive(path)}`}>
                    {path === '/' && <Home size={20} className="mr-2" />}
                    {path === '/medals' && <Medal size={20} className="mr-2" />}
                    {path === '/stats' && <BarChart3 size={20} className="mr-2" />}
                    <span>{path === '/' ? 'Schedule' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          <motion.button 
            className="md:hidden ml-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            className="md:hidden mt-4"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex justify-center space-x-4">
              {['/', '/medals', '/stats'].map((path) => (
                <motion.li key={path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to={path} className={`hover:text-blue-400 p-2 inline-flex flex-col items-center ${isActive(path)}`} onClick={() => setIsMenuOpen(false)}>
                    {path === '/' && <Home size={20} className="mb-1" />}
                    {path === '/medals' && <Medal size={20} className="mb-1" />}
                    {path === '/stats' && <BarChart3 size={20} className="mb-1" />}
                    <span className="text-xs">{path === '/' ? 'Schedule' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;