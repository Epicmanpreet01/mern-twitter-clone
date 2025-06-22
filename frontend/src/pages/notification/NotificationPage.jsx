import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import useNotifications from "../../hooks/queries/useNotifications";
import { useDeleteAllMutation, useDeleteOneMutation } from "../../hooks/mutations/useDeleteNotiMutation";
import { useState } from "react";

const NotificationPage = () => {

	const {data:notifications, isLoading} = useNotifications();
	const {mutate:deleteAllMutation, isPending:isDeleteAllPending} = useDeleteAllMutation();
	const {mutate:deleteOneMutation, isPending:isDeleteOnePending} = useDeleteOneMutation();

	const [loadingId,setLoadingId] = useState(false);

	const deleteNotifications = () => {
		deleteAllMutation();
	};

	const handleDeleteOne = (id) => {
		setLoadingId(id);
		deleteOneMutation(id, {
			onSettled: () => {
				setLoadingId(false);
			}
		});
	}

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a
									onClick={!isDeleteAllPending ? deleteNotifications : undefined}
									className={isDeleteAllPending ? "pointer-events-none opacity-50" : ""}
								>
									{isDeleteAllPending ? <LoadingSpinner /> : "Delete all notifications"}
								</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex justify-between items-center'>
							<div className="flex gap-2 p-4">
								{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
								{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
								<Link to={`/profile/${notification.from.userName}`}>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={notification.from.profileImage || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex gap-1'>
										<span className='font-bold'>@{notification.from.userName}</span>{" "}
										{notification.type === "follow" ? "followed you" : "liked your post"}
									</div>
								</Link>
							</div>
							<div>
								{isDeleteOnePending && loadingId === notification._id && <LoadingSpinner />}
								{!isDeleteAllPending && loadingId !== notification._id && <MdDelete className="text-2xl mr-4 cursor-pointer hover:text-red-400" onClick={() => handleDeleteOne(notification._id)} />}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;