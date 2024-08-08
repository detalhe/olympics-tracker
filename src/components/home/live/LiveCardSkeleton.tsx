import { motion } from "framer-motion";

const LiveCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
  >
    <div className="p-4 flex-grow">
      <div className="flex items-center mb-3">
        <motion.div
          animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-8 h-8 rounded-full mr-2"
        />
        <motion.div
          animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 rounded w-1/2"
        />
      </div>
      <motion.div
        animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-3 rounded w-3/4 mb-2"
      />
      <motion.div
        animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-3 rounded w-1/2 mb-1"
      />
      <motion.div
        animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-3 rounded w-2/3 mb-3"
      />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-3 rounded w-3/4"
          />
        ))}
      </div>
    </div>
    <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
      <motion.div
        animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-4 rounded w-1/4"
      />
      <motion.div
        animate={{ background: ["#f3f4f6", "#e5e7eb", "#f3f4f6"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-8 rounded w-1/4"
      />
    </div>
  </motion.div>
);

export default LiveCardSkeleton;
