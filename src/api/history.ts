import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { language } from '../stores/rootStore';
import useConfig from '../hooks/useConfig';

// Define the type for the expected response data
type DwgProgramResponse = {
  items: DwgProgramItem[];
  metadata: DwgProgramMetadata;
};

export type DwgProgramItem = {
  program_id: string;
  program_title: string;
  program_timestamp: string;
  program_url: string;
  program_download: string;
  program_author: string;
  program_description: string;
  program_tip: string;
  program_status: string;
};

type DwgProgramMetadata = {
  first_program_date: string;
  last_program_date: string;
  total_items: number;
  current_timestamp: string;
};

const allowedUrlPatterns = [
  `/${language}/micros-dynamis/`,
  `/${language}/play/`,
];

// Function to fetch data from the APIco
async function fetchProgram(url: string): Promise<DwgProgramResponse> {
  try {
    const response: AxiosResponse<DwgProgramResponse> = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const modifiedResponse: DwgProgramResponse = {
      ...response.data,
      items: response.data.items.map((item) => ({
        ...item,
        program_download: allowedUrlPatterns.some((pattern) =>
          item.program_download.includes(pattern)
        )
          ? item.program_download
          : '',
      })),
    };

    return modifiedResponse;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}

function useProgram(): UseQueryResult<DwgProgramResponse, Error> | undefined {
  const { configBase } = useConfig();
  const getProgram = useQuery({
    queryKey: ['program'],
    queryFn: () => fetchProgram(configBase.urlProgram),
  });
  if (!configBase.showProgramForRadio) return undefined;
  return getProgram;
}

export default useProgram;
