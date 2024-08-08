import { useEffect, useRef } from "react";
import { X, Clock, MapPin, Medal, Users, Play, Eye } from "lucide-react";
import { Game } from "../../services/fetchGames";
import { format, parseISO } from "date-fns";

type EventType = "live" | "upcoming" | "completed";

interface EventModalProps {
  game: Game;
  onClose: () => void;
  eventType: EventType;
}

const EventModal = ({ game, onClose, eventType }: EventModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const validCompetitors = game.competitors.filter((c) => c.competitor_name && c.country_flag_url);

  const today = new Date();
  const formattedDate = format(today, "d-MMMM").toLowerCase();
  const resultLink = `https://olympics.com/en/paris-2024/schedule/${formattedDate}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getActionButton = () => {
    switch (eventType) {
      case "live":
        return (
          <a
            href="https://olympics.com/en/paris-2024/videos/live"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors w-full sm:w-auto"
          >
            <Play size={20} />
            <span>Watch</span>
          </a>
        );
      case "upcoming":
        return null;
      case "completed":
        return (
          <a
            href={resultLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors w-full sm:w-auto"
          >
            <Eye size={20} />
            <span>View Results</span>
          </a>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6">
          <button onClick={onClose} className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <img src={game.discipline_pictogram} alt={game.discipline_name} className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full p-2" />
            <div className="flex-grow">
              <h2 className="text-xl sm:text-3xl font-bold text-white">{game.event_name}</h2>
              <p className="text-lg sm:text-xl text-blue-100">{game.discipline_name}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">{getActionButton()}</div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { Icon: MapPin, text: game.venue_name },
              { Icon: Clock, text: `${format(parseISO(game.start_date), "HH:mm")} - ${format(parseISO(game.end_date), "HH:mm")}` },
              { Icon: Medal, text: game.is_medal_event ? "Medal Event" : "Non-Medal Event", iconClass: "text-yellow-500" },
              { Icon: Users, text: `${validCompetitors.length} Competitors` },
            ].map(({ Icon, text, iconClass }, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-700">
                <Icon size={20} className={iconClass || "text-blue-500"} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Competitors</h3>
            {validCompetitors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {validCompetitors.map((competitor, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <img src={competitor.country_flag_url} alt={competitor.country_id} className="w-10 h-7 rounded shadow" />
                    <div>
                      <p className="font-medium text-gray-800">{competitor.competitor_name}</p>
                      <p className="text-sm text-gray-600">{competitor.country_id}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">Competitor information is not yet available for this event.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
