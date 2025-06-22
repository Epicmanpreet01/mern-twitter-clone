import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import usePosts from "../../hooks/queries/usePosts";

const Posts = ({ feedtype }) => {

	const { data: posts, isLoading} = usePosts(feedtype)

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
						<Post key={post._id} feedtype={feedtype} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;