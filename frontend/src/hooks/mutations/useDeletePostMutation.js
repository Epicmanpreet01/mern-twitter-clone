import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function useDeletePostMutation(feedtype) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async(id) => {
      try {
        const res = await axios.delete(`/api/post/delete/${id}`);
        const data = res.data;
        if(res.status !== 200) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error(`Error occured while deleting post: ${id} with error code: ${error.message}`)
        throw error
      }
    },
    onSuccess: () => {
      toast.success('Post Deleted successfully')
      queryClient.invalidateQueries({queryKey: ['posts', feedtype]})
    },
    onError: (error) => {
      console.error(`Error occured in mutation: ${error.message}`);
      toast.error(error.response?.data?.message || 'Failed to sign in');
    }
  })
}