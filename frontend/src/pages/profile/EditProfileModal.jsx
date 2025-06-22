import { useRef,useState } from "react";
import useUpdateProfileMutation from "../../hooks/mutations/updateProfileMutation";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfileModal = ({authUser}) => {
	const [formData, setFormData] = useState({
		name: authUser?.name,
		userName: authUser?.userName,
		email: authUser?.email,
		bio: authUser?.bio || '',
		link: authUser?.link || '',
		newPassword: '',
		currentPassword: '',
	});

	const modalRef = useRef(null);

	const {mutate:updateProfileMutation, isPending} = useUpdateProfileMutation(modalRef);

	const handleUpdate = () => {
		console.log('Updating with data:', formData); // ← Add this
		updateProfileMutation(formData);
	}

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id="edit_profile_modal" ref={modalRef} className="modal">
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							handleUpdate();
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.name}
								name='name'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.userName}
								name='userName'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md w-full'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button method="dialog" className='btn btn-primary rounded-full btn-sm text-white'>{isPending? <LoadingSpinner /> : 'Update'}</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;