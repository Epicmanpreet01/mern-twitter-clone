import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export default function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async() => {
      try {
        const res = await axios('/api/notification');
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
    },
    retry: 1,
  })
}