import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useUserProfile(userName) {
  return useQuery({
    queryKey: ['userProfile', userName],
    queryFn: async () => {
      try {
        const res = await axios(`/api/user/profile/${userName}`);
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error(`Error fetching user profile: ${error.message}`);
        throw error;
      }
    },
    retry: 1,
  })
}