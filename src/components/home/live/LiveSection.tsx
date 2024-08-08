import { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGames, Game } from "../../../services/fetchGames";
import LiveCard from "./LiveCard";
import LiveCardSkeleton from "./LiveCardSkeleton";

const LiveSection = () => {
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLiveGames();
  }, []);

  const loadLiveGames = async () => {
    try {
      const { liveGames } = await fetchGames();
      setLiveGames(liveGames);
      setLoading(false);
    } catch (error) {
      console.error("Error loading live games:", error);
      setError("Failed to fetch live games. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
        <span className="bg-red-100 text-red-800 py-2 px-4 rounded-lg flex items-center shadow-sm">
          <Activity className="mr-2" size={20} />
          Live Now
        </span>
        <span className="text-sm font-normal text-gray-600">
          {loading ? "Loading..." : `${liveGames.length} events`}
        </span>
      </h2>
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {[...Array(4)].map((_, index) => (
              <LiveCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        ) : liveGames.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No live games at the moment.
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {liveGames.map((game) => (
              <LiveCard key={game.id} game={game} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LiveSection;
