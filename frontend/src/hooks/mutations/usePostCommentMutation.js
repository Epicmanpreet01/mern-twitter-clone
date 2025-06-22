import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


export default function usePostCommentMutation(feedtype,) {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: async(id,commentData) => {
      try {
        console.log(commentData);
        const res = await axios.post('/api/post/comment/'+id, commentData);
        const data = res.data;
        if(data.error) throw new Error(data.error);
      } catch (error) {
        console.error(`Error occured while posting a comment on the post with id: ${id} with error code: ${error.message}`)
        throw error
      }
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({queryKey: ['posts', feedtype]});
    },
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    }
  })
}