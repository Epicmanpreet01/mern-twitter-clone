import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function usePosts(feedtype, userName) {
  const getPostEndpoint = () => {
    if (feedtype === 'forYou') return '/api/post/all';
    if (feedtype === 'following') return '/api/post/following';
    if (feedtype === 'posts') return `/api/post/user/${userName}`;
    if (feedtype === 'likes') return `/api/post/liked/${userName}`;
    return '/api/post/all';
  };

  const POSTS_ENDPOINT = getPostEndpoint();

  return useQuery({
    queryKey: ['posts', feedtype, userName],
    queryFn: async () => {
      try {
        const res = await axios(POSTS_ENDPOINT);
        return res.data.data;
      } catch (error) {
        console.error(`Error occurred while fetching posts: ${error.message}`);
        throw error;
      }
    },
    retry: false,
    keepPreviousData: false
  });
}