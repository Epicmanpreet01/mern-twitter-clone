import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function useUpdateProfileMutation(modalRef) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post('/api/user/update', data);
        const updatedProfile = res.data;
        if (updatedProfile.error) throw new Error(updatedProfile.error);
        return updatedProfile.data;
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', updatedProfile.userName] });
      modalRef.current?.close(); 
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error in useUpdateProfileMutation:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  });
}