import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import usePosts from "../../hooks/queries/usePosts";

const Posts = ({ feedtype, userName }) => {

	const { data: posts, isLoading,isFetching} = usePosts(feedtype,userName)

	return (
		<>
			{isFetching && isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isFetching && !isLoading && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isFetching && !isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} feedtype={feedtype} post={post} userName={userName} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;