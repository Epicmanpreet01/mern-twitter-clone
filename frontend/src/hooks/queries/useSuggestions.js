import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useSuggestions() {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: async() => {
      try {
        const res = await axios('/api/user/suggestion');
        const { data } = res;
        if(data.error && !data.data) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
      }
    },
    retry: 1,
  })
}