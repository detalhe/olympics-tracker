import axios from 'axios';

const API_BASE_URL = 'https://apis.codante.io/olympic-games';

export interface Country {
  id: string;
  name: string;
  continent: string;
  flag_url: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  rank: number;
  rank_total_medals: number;
}

export interface Event {
  id: number;
  discipline_name: string;
  event_name: string;
  is_medal_event: number;
}

export async function fetchStatsData(): Promise<{ countries: Country[], events: Event[] }> {
  try {
    const [countriesResponse, eventsResponse] = await Promise.all([
      axios.get<{ data: Country[] }>(`${API_BASE_URL}/countries`, { params: { per_page: 1000 } }),
      axios.get<{ data: Event[] }>(`${API_BASE_URL}/events`, { params: { per_page: 1000 } })
    ]);

    return {
      countries: countriesResponse.data.data,
      events: eventsResponse.data.data
    };
  } catch (error) {
    console.error('Error fetching stats data:', error);
    throw error;
  }
}
