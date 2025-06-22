import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


export default function usePostCommentMutation(feedtype,post, userName) {
  
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async({id,commentData}) => {
      try {
        console.log(commentData);
        const res = await axios.post('/api/post/comment/'+id, commentData);
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error(`Error occured while posting a comment on the post with id: ${id} with error code: ${error.message}`)
        throw error
      }
    },
    onSuccess: (commentData) => {
      QueryClient.setQueryData(['posts', feedtype, userName], (oldposts) => {
        if (!oldposts) return oldposts;

        return oldposts.map(p => {
          if (p._id === post._id) {
            const updatedComments = Array.isArray(p.comments) ? [...p.comments, commentData] : [commentData];
            return { ...p, comments: updatedComments };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      console.error(`Error occured in mutation: ${error.message}`);
      toast.error(error.response?.data?.message || 'Failed to post comment');
    }
  })
}