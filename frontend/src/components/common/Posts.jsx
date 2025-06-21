import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';

const Posts = ({ feedtype }) => {
	// const isLoading = false;

	const getPostEndpoint = () => {
		if (feedtype === 'forYou') return '/api/post/all';
		if (feedtype === 'following') return '/api/post/following';
		return '/api/post/all';
	};

	const POSTS_ENDPOINT = getPostEndpoint();

	const { data: posts, isLoading} = useQuery({
		queryKey: ['posts', feedtype], // <-- dynamic key based on feedtype
		queryFn: async () => {
			try {
				const res = await axios(getPostEndpoint());
				return res.data.data;
			} catch (error) {
				console.log(`Error occurred while fetching posts: ${error.message}`);
			}
		},
		retry: false
	});


	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;