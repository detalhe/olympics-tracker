import axios from 'axios';
import { format, parseISO, isAfter, isBefore, isWithinInterval, differenceInMinutes, differenceInHours } from 'date-fns';

export interface Competitor {
  country_id: string;
  country_flag_url: string;
  competitor_name: string;
  result_winnerLoserTie?: string;
  result_mark?: string;
}

export interface Game {
  id: number;
  discipline_name: string;
  discipline_pictogram: string;
  event_name: string;
  venue_name: string;
  start_date: string;
  end_date: string;
  status: string;
  competitors: Competitor[];
  is_medal_event: number;
}

interface ApiResponse {
  data: Game[];
  meta: {
    current_page: number;
    last_page: number;
  };
}

const API_BASE_URL = 'https://apis.codante.io/olympic-games';

export async function fetchGames(): Promise<{ liveGames: Game[], upcomingGames: Game[], completedGames: Game[] }> {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const now = new Date();
  let currentPage = 1;
  let allGames: Game[] = [];
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/events`, {
        params: {
          date: currentDate,
          page: currentPage,
        },
      });

      allGames = [...allGames, ...response.data.data];

      if (currentPage >= response.data.meta.last_page) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
    }

    const liveGames = allGames.filter(game => 
      isWithinInterval(now, {
        start: parseISO(game.start_date),
        end: parseISO(game.end_date)
      })
    );

    const upcomingGames = allGames.filter(game => 
      isAfter(parseISO(game.start_date), now)
    ).sort((a, b) => 
      parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
    );

    const completedGames = allGames.filter(game => 
      isBefore(parseISO(game.end_date), now) && game.status === 'Finished'
    ).map(game => ({
      ...game,
      competitors: game.competitors.filter(
        competitor => competitor.competitor_name && competitor.country_flag_url
      )
    })).sort((a, b) => 
      parseISO(b.end_date).getTime() - parseISO(a.end_date).getTime()
    );

    return { liveGames, upcomingGames, completedGames };
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

export function getTimeUntilStart(startDate: string): string {
  const now = new Date();
  const start = parseISO(startDate);
  const minutesUntilStart = differenceInMinutes(start, now);
  const hoursUntilStart = differenceInHours(start, now);

  if (minutesUntilStart < 60) {
    return `${minutesUntilStart}min`;
  } else {
    return `${hoursUntilStart}h`;
  }
}

export function getTimeCompletedAgo(endDate: string): string {
  const now = new Date();
  const end = parseISO(endDate);
  const minutesAgo = differenceInMinutes(now, end);
  const hoursAgo = differenceInHours(now, end);

  if (minutesAgo < 60) {
    return `${minutesAgo}min ago`;
  } else {
    return `${hoursAgo}h ago`;
  }
}
