import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


export function useDeleteOneMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.delete(`/api/notification/${id}`);
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
      toast.success("Notification deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting notification: ${error.message}`);
      console.error("Error deleting notification:", error.message);
    }
  })
}

export function useDeleteAllMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete(`/api/notification`);
        const data = res.data;
        if(data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.error("Error deleting all notifications:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queueKey: ['notifications']});
      toast.success("All notifications deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting notifications: ${error.message}`);
      console.error("Error deleting notifications:", error.message);
    }
  })
}