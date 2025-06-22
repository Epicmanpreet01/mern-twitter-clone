import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function useCreatePostMutation(feedtype, userName) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async(postData) => {
      try {
        const res = await axios.post('/api/post/create', postData);
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data.data;
      } catch (error) {
        console.error(`Error occured while creating post: ${error.message}`)
        throw error
      }
    },
    onSuccess: () =>{
      toast.success('Post created successfully');
      queryClient.invalidateQueries({queryKey: ['posts',feedtype, userName]});
    },
    onError: (error) => {
      console.error(`Error occured in mutation: ${error.message}`);
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  })
}