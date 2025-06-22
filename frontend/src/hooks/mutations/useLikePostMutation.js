import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function useLikePostMutation(feedtype) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async(id) => {
      try {
        const res = await axios.post('/api/post/like/'+id)
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.error(`Error occured while liking the post with id: ${id} with error code: ${error.message}`)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['posts', feedtype]});
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
}