import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import useAuthUser from "../../hooks/queries/useAuthUser";
import useDeletePostMutation from "../../hooks/mutations/useDeletePostMutation";

import LoadingSpinner from './LoadingSpinner'

import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import useLikePostMutation from "../../hooks/mutations/useLikePostMutation";
import usePostCommentMutation from "../../hooks/mutations/usePostCommentMutation";
import EmojiPicker from "emoji-picker-react";

const Post = ({ post,feedtype, userName }) => {
	
	const {data:authUser} = useAuthUser();
	const {mutate:deletePostMutuation, isPending:deletePending} = useDeletePostMutation(feedtype,userName);
	const {mutate:likePostMutation, isPending:isLiking} = useLikePostMutation(feedtype,post, userName);
	const {mutate:postComment, isPending} = usePostCommentMutation(feedtype, post, userName);

	const postOwner = post.poster;
	const isLiked = post.likes.includes(authUser._id);

	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [emojiKeyBoard,setEmojiKeyBoard] = useState(false);

	const imgRef = useRef(null);

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const isMyPost = postOwner._id === authUser._id;
	const formattedDate = new Date(post.createdAt).toLocaleString();

	const handleDeletePost = (id) => {
		deletePostMutuation(id)
	};

	const handlePostComment = (e,id) => {
		setImg(null);
		setText('');
		e.preventDefault();
		const commentData = {
			text,
			img
		}
		console.log(commentData)
		postComment({id,commentData});
	};

	const handleLikePost = (id) => {
		likePostMutation(id)
	};

	const handleEmojiClick = (emojiData) => {
		setText((prevText) => prevText+ emojiData.emoji);
	}

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.userName}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImage || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.userName}`} className='font-bold'>
							{postOwner.name}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.userName}`}>@{postOwner.userName}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{deletePending ? (
									<LoadingSpinner />
								) : (
									<FaTrash
										className="cursor-pointer hover:text-red-500"
										onClick={() => handleDeletePost(post._id)}
									/>
								)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box h-11/12 w-11/12 max-w-5xl rounded border border-gray-600 flex flex-col'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex-1 overflow-y-auto flex flex-col gap-3 px-4 py-2'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.poster.profileImage || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.poster.name}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.poster.userName}
														</span>
													</div>
													<div className='flex flex-col gap-3 overflow-hidden'>
														<span>{comment.text}</span>
														{comment.img && (
															<img
																src={comment.img}
																className='w-60 h-60 object-cover rounded-lg border border-gray-700'
																alt=''
															/>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
										<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
											<div className='avatar'>
												<div className='w-8 rounded-full'>
													<img src={authUser.profileImage || "/avatar-placeholder.png"} />
												</div>
											</div>
											<form className='flex flex-col gap-2 w-full' onSubmit={(e) => handlePostComment(e,post._id)}>
												<textarea
													className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
													placeholder='Post your reply'
													value={text}
													onChange={(e) => setText(e.target.value)}
												/>
												{img && (
													<div className='relative w-72 mx-auto'>
														<IoCloseSharp
															className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
															onClick={() => {
																setImg(null);
																imgRef.current.value = null;
															}}
														/>
														<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
													</div>
												)}

												<div className='flex justify-between border-t py-2 border-t-gray-700'>
													<div className='flex gap-1 items-center'>
														<CiImageOn
															className='fill-primary w-6 h-6 cursor-pointer'
															onClick={() => imgRef.current.click()}
														/>
														<div className="relative">
															<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' onClick={() => setEmojiKeyBoard(!emojiKeyBoard)}/>
															<EmojiPicker open={emojiKeyBoard} theme="dark" onEmojiClick={handleEmojiClick} style={{
																position:'absolute',
																bottom: 50,
															}} />
														</div>
													</div>
													<input type='file' accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
													<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
														{isPending ? <LoadingSpinner /> : "Post"}
													</button>
												</div>
											</form>
										</div>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={() => handleLikePost(post._id)}>
								{isLiking && <LoadingSpinner size="sm" />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;