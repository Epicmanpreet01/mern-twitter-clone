import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function usePosts(feedtype) {
  const getPostEndpoint = () => {
    if (feedtype === 'forYou') return '/api/post/all';
    if (feedtype === 'following') return '/api/post/following';
    return '/api/post/all';
  };

  const POSTS_ENDPOINT = getPostEndpoint();

  return useQuery({
    queryKey: ['posts', feedtype],
    queryFn: async () => {
      try {
        const res = await axios(POSTS_ENDPOINT);
        return res.data.data;
      } catch (error) {
        console.log(`Error occurred while fetching posts: ${error.message}`);
        throw error;
      }
    },
    retry: false,
  });
}