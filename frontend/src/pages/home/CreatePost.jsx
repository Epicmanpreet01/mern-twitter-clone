import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

import useAuthUser from "../../hooks/queries/useAuthUser.js";
import useCreatePostMutation from "../../hooks/mutations/useCreatePostMutation.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

import EmojiPicker from 'emoji-picker-react';

const CreatePost = ({feedtype}) => {

	const {data:authUser} = useAuthUser();
	const {mutate:createPostMutation, isPending} = useCreatePostMutation(feedtype);

	const [emojiKeyBoard,setEmojiKeyBoard] = useState(false);
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const imgRef = useRef(null);

	const handleSubmit = (e) => {
		setText('');
		setImg(null);
		e.preventDefault();
		createPostMutation({text,img});
	};

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

	const handleEmojiClick = (emojiData) => {
		setText((prevText) => prevText+ emojiData.emoji);
	}

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImage || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
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

				<div className='flex justify-between border-t py-2 border-t-gray-700 relative'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<div className="relative">
							<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' onClick={() => setEmojiKeyBoard(!emojiKeyBoard)}/>
							<EmojiPicker open={emojiKeyBoard} theme="dark" onEmojiClick={handleEmojiClick} style={{
								position:'absolute',
								top: 30,
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
	);
};
export default CreatePost;