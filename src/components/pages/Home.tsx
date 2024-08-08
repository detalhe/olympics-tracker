import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveSection from '../home/live/LiveSection';
import UpcomingSection from '../home/upcoming/UpcomingSection';
import FinishedSection from "../home/completed/CompletedSection";
import { fetchGames } from '../../services/fetchGames';

function Home() {
  const [liveCount, setLiveCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const { liveGames, upcomingGames, completedGames } = await fetchGames();

      setLiveCount(liveGames.length);
      setUpcomingCount(upcomingGames.length);
      setCompletedCount(completedGames.length);
    };

    fetchCounts();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
      className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <main className="container mx-auto py-12 px-4">
        <motion.h1 variants={itemVariants} className="text-4xl font-extrabold mb-4 text-center bg-clip-text bg-gradient-to-r text-gray-900">
          Paris 2024 Olympics Schedule
        </motion.h1>
        <motion.p variants={itemVariants} className="text-center text-gray-600 mb-6 text-lg">Today's Schedule: {today}</motion.p>

        <motion.div variants={itemVariants} className="flex justify-center space-x-8 mb-12">
          {[
            { count: liveCount, label: 'Occurring', color: 'text-red-500' },
            { count: upcomingCount, label: 'Upcoming', color: 'text-yellow-500' },
            { count: completedCount, label: 'Finished', color: 'text-green-500' }
          ].map(({ count, label, color }) => (
            <motion.div key={label} className="text-center" whileHover={{ scale: 1.05 }}>
              <motion.span 
                className={`text-3xl font-bold ${color}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {count}
              </motion.span>
              <p className="text-sm text-gray-600">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}><LiveSection /></motion.div>
        <motion.div variants={itemVariants}><UpcomingSection /></motion.div>
        <motion.div variants={itemVariants}><FinishedSection /></motion.div>
      </main>
    </motion.div>
  );
}

export default Home;