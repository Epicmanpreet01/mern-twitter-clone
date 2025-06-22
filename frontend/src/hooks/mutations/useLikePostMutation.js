import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function useLikePostMutation(feedtype, post, userName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async(id) => {
      try {
        const res = await axios.post('/api/post/like/'+id)
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error(`Error occured while liking the post with id: ${id} with error code: ${error.message}`)
        throw error
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(['posts', feedtype, userName], (oldPosts) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      console.error(`Error occured in mutation: ${error.message}`);
      toast.error(error.response?.data?.message || 'Failed to like post');
    }
  })
}