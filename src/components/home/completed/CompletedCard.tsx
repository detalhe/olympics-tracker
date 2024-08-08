import { useState } from "react";
import { MapPin, Clock, Medal, Eye, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Game, getTimeCompletedAgo } from "../../../services/fetchGames";
import EventModal from "../EventModal";

const CompletedCard = ({ game }: { game: Game }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const initialCompetitorsToShow = 4;

  const today = new Date();
  const formattedDate = format(today, 'd-MMMM').toLowerCase();
  const resultLink = `https://olympics.com/en/paris-2024/schedule/${formattedDate}`;

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full cursor-pointer transition-transform hover:scale-105"
        onClick={() => setModalOpen(true)}
      >
        <div className="p-4 flex-grow">
          <div className="flex items-center mb-3">
            <img src={game.discipline_pictogram} alt={game.discipline_name} className="w-8 h-8 mr-2" />
            <h3 className="font-semibold text-sm">{game.discipline_name}</h3>
            <span className="bg-green-500 text-white text-xs py-1 px-2 rounded-full font-medium ml-auto">{getTimeCompletedAgo(game.end_date)}</span>
          </div>
          <p className="text-xs text-gray-600 mb-2 font-medium">{game.event_name}</p>
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <MapPin size={12} className="mr-1" />
            <span>{game.venue_name}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Clock size={12} className="mr-1" />
            <span>{format(parseISO(game.end_date), "HH:mm")}</span>
          </div>
          <div className="flex-grow">
            {game.competitors.slice(0, initialCompetitorsToShow).map((competitor, index) => (
              <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                <div className="flex items-center">
                  <img src={competitor.country_flag_url} alt={competitor.country_id} className="w-6 h-4 mr-2" />
                  <span className={`text-sm ${competitor.result_winnerLoserTie === "W" ? "font-bold" : ""}`}>{competitor.competitor_name}</span>
                </div>
                <span className={`text-sm ${competitor.result_winnerLoserTie === "W" ? "font-bold" : ""}`}>{competitor.result_mark}</span>
              </div>
            ))}
            {game.competitors.length > initialCompetitorsToShow && (
              <div className="flex items-center justify-between mt-2 py-1 px-2 bg-gray-100 rounded text-xs text-gray-500 border border-gray-200">
                <span>Click to view more</span>
                <ChevronRight size={14} />
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
          <span className="text-xs font-medium text-gray-600 flex items-center">
            <Medal className="mr-1 text-yellow-500" size={16} />
            {game.is_medal_event ? "Medal Event" : "Non-Medal"}
          </span>
          <button 
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center font-medium"
            onClick={(e) => { 
              e.stopPropagation(); 
              window.open(resultLink, '_blank');
            }}
          >
            <Eye size={16} className="mr-1" />
            View Results
          </button>
        </div>
      </div>
      {modalOpen && <EventModal game={game} onClose={() => setModalOpen(false)} eventType="completed" />}
    </>
  );
};

export default CompletedCard;
