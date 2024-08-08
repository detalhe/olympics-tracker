import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Medal, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchMedalsData } from '../../services/fetchMedalsData';

interface Country {
  id: string;
  name: string;
  flag_url: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  rank: number;
}

const Medals = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [displayedCountries, setDisplayedCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCountries, setTotalCountries] = useState(0);

  useEffect(() => {
    const fetchAllMedals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMedalsData();
        setAllCountries(data);
        setTotalCountries(data.length);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching medal data:', error);
        setIsLoading(false);
      }
    };

    fetchAllMedals();
  }, []);

  useEffect(() => {
    const filtered = allCountries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTotalPages(Math.ceil(filtered.length / 20));
    setDisplayedCountries(filtered.slice((currentPage - 1) * 20, currentPage * 20));
  }, [searchTerm, allCountries, currentPage]);

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    const sortedCountries = [...displayedCountries].sort((a, b) => {
      return newDirection === 'asc' ? a.rank - b.rank : b.rank - a.rank;
    });
    setDisplayedCountries(sortedCountries);
  };

  const PageNavigation = () => (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors duration-300 disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors duration-300 disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-4xl font-extrabold mb-14 text-center text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Paris 2024 Olympics Medals
        </motion.h1>
        
        <div className="flex justify-between items-center mb-4">
          <PageNavigation />
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search countries..."
              className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="text-gray-600">
            Total Countries: {totalCountries}
          </div>
        </div>

        <motion.div 
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                {['Rank', 'Country', 'Gold', 'Silver', 'Bronze', 'Total'].map((header, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left ${header === 'Rank' ? 'cursor-pointer hover:bg-gray-800 transition-colors' : ''}`}
                    onClick={header === 'Rank' ? handleSort : undefined}
                  >
                    <div className="flex items-center">
                      {header}
                      {header === 'Rank' && (
                        sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : (
                  displayedCountries.map((country, index) => (
                    <motion.tr
                      key={country.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                    >
                      <td className="px-6 py-4 text-center">{country.rank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={country.flag_url} alt={`${country.name} flag`} className="w-8 h-6 mr-3 rounded shadow" />
                          <span className="font-medium">{country.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full w-16">
                          <Medal size={16} className="mr-1 text-yellow-500" />
                          {country.gold_medals}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full w-16">
                          <Medal size={16} className="mr-1 text-gray-400" />
                          {country.silver_medals}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full w-16">
                          <Medal size={16} className="mr-1 text-orange-500" />
                          {country.bronze_medals}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-center">{country.total_medals}</td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default Medals;
