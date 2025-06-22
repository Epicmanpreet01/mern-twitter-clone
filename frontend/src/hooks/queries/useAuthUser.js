import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useAuthUser() {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await axios('/api/oauth/me');
        const data = res.data;
        if(res.status !==200) throw new Error(data.message);
        return data;
      } catch (error) {
        console.error(`Error occured while fetching user data: ${error.message}`);
        return null
      }
    },
    retry: false,
  })
}