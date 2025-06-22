import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from './LoadingSpinner.jsx'
import useSuggestions from "../../hooks/queries/useSuggestions.js";
import { useState } from "react";
import useFollowMutation from '../../hooks/mutations/useFollowMutation.js'

const RightPanel = () => {

	const { data:suggestions, isLoading } = useSuggestions();
	const { mutate:followUnfollowMutation } = useFollowMutation();
	const [loadingId, setLoadingId] = useState(null);

  const handleClick = (e, id) => {
    e.preventDefault();
    setLoadingId(id);
    followUnfollowMutation(id, {
      onSettled: () => setLoadingId(null), 
    });
  };

	if (suggestions?.length === 0) return <div className="lg:w-64 w-0"></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestions?.map((user) => (
							<Link
								to={`/profile/${user.userName}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImage || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.name}
										</span>
										<span className='text-sm text-slate-500'>@{user.userName}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => handleClick(e,user._id)}
										key={user._id}
									>
										{loadingId === user._id ? <LoadingSpinner /> : 'Follow'}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;