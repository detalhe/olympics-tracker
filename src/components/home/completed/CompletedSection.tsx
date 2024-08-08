import { useState, useEffect, useRef } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchGames, Game } from "../../../services/fetchGames";
import CompletedCard from "./CompletedCard";
import CompletedCardSkeleton from "./CompletedCardSkeleton";

const CompletedSection = () => {
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleGames, setVisibleGames] = useState(4);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadCompletedGames();
  }, []);

  const loadCompletedGames = async () => {
    try {
      const { completedGames } = await fetchGames();
      setCompletedGames(completedGames);
      setLoading(false);
    } catch (error) {
      console.error("Error loading completed games:", error);
      setError("Failed to fetch completed games. Please try again later.");
      setLoading(false);
    }
  };

  const showMoreGames = () => setVisibleGames(Math.min(visibleGames + 4, completedGames.length));
  const showLessGames = () => {
    setVisibleGames(4);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const showAllGames = () => setVisibleGames(completedGames.length);

  return (
    <section ref={sectionRef} className="mb-16">
      <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
        <span className="bg-green-100 text-green-800 py-2 px-4 rounded-lg flex items-center shadow-sm">
          <CheckCircle className="mr-2" size={20} />
          Completed
        </span>
        <span className="text-sm font-normal text-gray-600">
          {loading ? "Loading..." : `${completedGames.length} events`}
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
              <CompletedCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {error}
          </motion.div>
        ) : completedGames.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            No completed games for today.
          </motion.p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {completedGames.slice(0, visibleGames).map((game) => (
                <CompletedCard key={game.id} game={game} />
              ))}
            </motion.div>
            {completedGames.length > 4 && (
              <div className="mt-8 text-center space-x-4">
                {visibleGames < completedGames.length && (
                  <button
                    onClick={showMoreGames}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors inline-flex items-center font-medium"
                  >
                    <ChevronDown size={16} className="mr-2" />
                    Show More
                  </button>
                )}
                {visibleGames > 4 && (
                  <button
                    onClick={showLessGames}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors inline-flex items-center font-medium"
                  >
                    <ChevronUp size={16} className="mr-2" />
                    Show Less
                  </button>
                )}
                {visibleGames < completedGames.length && (
                  <button
                    onClick={showAllGames}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Show All ({completedGames.length})
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CompletedSection;
