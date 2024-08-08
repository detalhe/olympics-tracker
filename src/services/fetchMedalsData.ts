import axios from 'axios';

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

interface ApiResponse {
  data: Country[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export const fetchMedalsData = async (): Promise<Country[]> => {
  try {
    let allData: Country[] = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
      const response = await axios.get<ApiResponse>(`https://apis.codante.io/olympic-games/countries?page=${currentPage}`);
      allData = [...allData, ...response.data.data];
      lastPage = response.data.meta.last_page;
      currentPage++;
    } while (currentPage <= lastPage);

    return allData;
  } catch (error) {
    console.error('Error fetching medal data:', error);
    throw error;
  }
};