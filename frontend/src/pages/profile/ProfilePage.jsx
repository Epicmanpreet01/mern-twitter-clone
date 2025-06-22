import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import useUserProfile from "../../hooks/queries/useUserProfile";
import useAuthUser from "../../hooks/queries/useAuthUser";
import useFollowMutation from "../../hooks/mutations/useFollowMutation.js";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useUpdateProfileMutation from "../../hooks/mutations/updateProfileMutation.js";

const ProfilePage = () => {

	const {userName} = useParams()
	const [feedType, setFeedType] = useState("posts");

	const {data:authUser} = useAuthUser();
	const {data:user, isLoading} = useUserProfile(userName);
	const {mutate:followMutation, isPending} = useFollowMutation();
	const {mutateAsync:updateUser, isPending:isUpdating} = useUpdateProfileMutation('',authUser?.userName);


	const [bannerImage, setbannerImage] = useState(null);
	const [profileImage, setprofileImage] = useState(null);
	

	const bannerImageRef = useRef(null);
	const profileImageRef = useRef(null);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "bannerImage" && setbannerImage(reader.result);
				state === "profileImage" && setprofileImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};
	
	const handleFollow = (id) => {
		followMutation(id);
	}

	const handleUpdate = async () => {
		await updateUser({
			bannerImage: bannerImage,
			profileImage: profileImage
		});
		setbannerImage(null);
		setprofileImage(null);
	}

	const isMyProfile = !isLoading && user._id === authUser._id;
	const formatedJoinDate = new Date(user?.createdAt).toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric'
	})
	const following = authUser?.following.includes(user?._id);

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{isLoading && <ProfileHeaderSkeleton />}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.name}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={bannerImage || user?.bannerImage || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => bannerImageRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									ref={bannerImageRef}
									onChange={(e) => handleImgChange(e, "bannerImage")}
								/>
								<input
									type='file'
									hidden
									ref={profileImageRef}
									onChange={(e) => handleImgChange(e, "profileImage")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImage || user?.profileImage || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImageRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal authUser={authUser} />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => handleFollow(user?._id)}
									>
										{isPending && <LoadingSpinner />}
										{!isPending && following && 'Unfollow'}
										{!isPending && !following && 'Follow'}
									</button>
								)}
								{(bannerImage || profileImage) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={handleUpdate}
									>
										{isUpdating? <LoadingSpinner /> : 'Update'}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.name}</span>
									<span className='text-sm text-slate-500'>@{user?.userName}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={`${user?.link}`}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>Joined {formatedJoinDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedtype={feedType} userName={user?.userName} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;