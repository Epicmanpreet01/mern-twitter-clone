import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function useLikePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async(id) => {
      try {
        const res = await axios.post(`/api/user/follow/${id}`);
        const data = res.data;
        if (data.error) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error(`Error occurred while liking post: ${error.message}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Follow/Unfollow action successful');
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suggestions'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
      ])
    },
    onError: (error) => {
      console.error(`Error occured in mutation: ${error.message}`);
      toast.error(error.response?.data?.message || 'Failed to follow/unfollow user');
    },
  })
}