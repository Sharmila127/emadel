/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { FONTS } from '@/constants/ui constants';
import { MoreVertical, X } from 'lucide-react';
import {
	getActivityThunks,
	getProfileThunks,
} from '@/features/Profile/reducers/thunks';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxhooks';
import { GetImageUrl } from '@/utils/helper';
import {
	fileupload,
	updateProfile,
} from '@/features/Profile/services';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';


const SkeletonLoader = () => {
	return (
		<div className="grid gap-4 animate-pulse">

			<div className="shadow-[0px_0px_15px_0px_#0000001A] p-4 rounded-lg">
				<section className="flex items-center gap-5">
					<div className="h-[60px] w-[60px] bg-gray-200 rounded-lg"></div>
					<div className="h-6 bg-gray-200 rounded w-1/3"></div>
				</section>
				<hr className="my-4" />


				<div>
					<div className="h-5 bg-gray-200 rounded w-1/6 mb-6"></div>

					<div className="mt-6 grid grid-cols-4 gap-5">
						{[...Array(7)].map((_, i) => (
							<section key={i}>
								<div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
								<div className="h-5 bg-gray-300 rounded w-full"></div>
							</section>
						))}
					</div>
				</div>

				{/* Edit Button Skeleton */}
				<div className="mt-10 text-end">
					<div className="h-10 bg-gray-200 rounded-tl-xl rounded-br-xl w-32 inline-block"></div>
				</div>
			</div>


			<div className="shadow-[0px_0px_15px_0px_#0000001A] p-4 rounded-lg min-h-[250px]">
				<section className="flex justify-between items-center">
					<div className="h-6 bg-gray-200 rounded w-1/4"></div>
					<div className="h-6 w-6 bg-gray-200 rounded-full"></div>
				</section>

				<div className="flex gap-4 overflow-x-scroll scrollbar-hidden p-3 my-3">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="shadow-[0px_0px_15px_0px_#0000001A] min-w-[400px] rounded-lg p-4">
							<div className="h-4 bg-gray-200 rounded w-1/6 mb-3"></div>
							<div className="my-1">
								<div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-5/6"></div>
							</div>
							<div className="h-3 bg-gray-200 rounded w-2/3 mt-3 ml-auto"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const ProfileDetails = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState<any>(''); // default image
	const [formData, setFormData] = useState<any>({
		first_name: '',
		last_name: '',
		username: '',
		email: '',
		phone_number: '',
		image: '',
	});
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useAppDispatch();
	const profileData: any = useAppSelector((state) => state.ProfileSlice.data);
	const activityData: any = useAppSelector(
		(state) => state.ProfileSlice.activity
	);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setPreviewImage(imageUrl);

			const fileData = new FormData();
			fileData.append('file', file);

			try {
				const uploadResponse = await fileupload(fileData);
				console.log(uploadResponse, 'Upload Response');

				const uploadedFilePath = uploadResponse?.data?.data?.file;

				if (uploadedFilePath) {
					toast.success('Image uploaded');
					setPreviewImage(uploadedFilePath);
					setFormData((prev: any) => ({
						...prev,
						image: uploadedFilePath,
					}));
				}
			} catch (error) {
				console.error('File upload failed', error);
				toast.error('Image upload failed');
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await updateProfile(formData);
			console.log(response, 'Updated');
			toast.success('Profile updated successfully');

			dispatch(getProfileThunks({}));
			setIsModalOpen(false);
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('Failed to update profile');
		}
	};

	const openModal = () => {
		setIsModalOpen(true);
	};

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				await Promise.all([
					dispatch(getProfileThunks({})),
					dispatch(getActivityThunks({}))
				]);
			} catch (error) {
				console.error('Error fetching data:', error);
				toast.error('Failed to load profile data');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [dispatch]);

	useEffect(() => {
		if (profileData) {
			setFormData({
				first_name: profileData.first_name || '',
				last_name: profileData.last_name || '',
				username: profileData.username || '',
				email: profileData.email || '',
				phone_number: profileData.phone_number || '',
				image: profileData.image,
			});
			setPreviewImage(profileData?.image);
		}
	}, [profileData]);


	if (isLoading) {
		return <SkeletonLoader />;
	}

	return (
		<div className='grid gap-4'>
			{/* Profile Card */}
			<div className='shadow-[0px_0px_15px_0px_#0000001A] p-4 rounded-lg'>
				<section className='flex items-center gap-5 '>
					<img
						src={GetImageUrl(profileData?.image) ?? undefined}
						alt='profile Image'
						className='h-[60px] w-[60px] shadow-[0px_0px_15px_0px_#0000001A] rounded-lg object-cover'
					/>
					<h1 style={{ ...FONTS.pass_head }}>
						{profileData?.first_name} {profileData?.last_name}
					</h1>
				</section>
				<hr className='my-4' />

				{/* Details */}
				<div>
					<h1 style={{ ...FONTS.profile_head }}>Details</h1>

					<div className='mt-6 grid grid-cols-4 gap-5'>
						<section>
							<p style={{ ...FONTS.profile_title }}>First Name</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								{profileData?.first_name}
							</h1>
						</section>
						<section>
							<p style={{ ...FONTS.profile_title }}>Last Name</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								{profileData?.last_name}
							</h1>
						</section>
						<section>
							<p style={{ ...FONTS.profile_title }}>User Name</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								{profileData?.username}
							</h1>
						</section>
						<section>
							<p style={{ ...FONTS.profile_title }}>Designation</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								Project Manager
							</h1>
						</section>
						<section>
							<p style={{ ...FONTS.profile_title }}>Email</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								{profileData?.email}
							</h1>
						</section>
						<section>
							<p style={{ ...FONTS.profile_title }}>Status</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								{profileData?.is_active ? 'Active' : 'In-Active'}
							</h1>
						</section>
						<section>
							<p style={{ ...FONTS.profile_title }}>Contact</p>
							<h1 style={{ ...FONTS.pass_head_2 }} className='break-words'>
								{profileData?.phone_number}
							</h1>
						</section>
					</div>
				</div>

				{/* Edit Button */}
				<div className='mt-10 text-end'>
					<button
						onClick={openModal}
						className='bg-[#68B39F] border-transparent text-white p-2 rounded-tl-xl rounded-br-xl'
						style={{ ...FONTS.btn_txt_active }}
					>
						Edit Details
					</button>
				</div>
			</div>

			{/* Activity Timeline */}
			<div className='shadow-[0px_0px_15px_0px_#0000001A] p-4 rounded-lg min-h-[250px] overflow-x-auto scrollbar-hidden'>
				<section className='flex justify-between items-center'>
					<h1 style={{ ...FONTS.pass_head }}>User Activity Timeline</h1>
					<MoreVertical size={25} />
				</section>

				<div className='flex gap-4 overflow-x-scroll scrollbar-hidden p-3 my-3'>
					{activityData?.map((data: any) => {
						return (
							<div className='shadow-[0px_0px_15px_0px_#0000001A] min-w-[400px] rounded-lg p-4'>
								<p style={{ ...FONTS.activity }}>Note</p>
								<div className='my-1'>
									<p style={{ ...FONTS.edit_form }}>{data?.action}</p>
									<p
										style={{
											...FONTS.card_text,
											display: '-webkit-box',
											WebkitLineClamp: 1,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
										}}
										className='text-[#999999]'
									>
										{data.title}
									</p>{' '}
								</div>
								<p style={{ ...FONTS.edit_form }} className='text-end mt-3'>
									{dayjs(data?.updatedAt).format('MMM DD,YYYY')} At{' '}
									{dayjs(data?.updatedAt).format('HH:MM A')}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-6 rounded-lg w-[70%] max-h-[90vh] overflow-auto scrollbar-hidden shadow-lg'>
						<div className='flex justify-between items-center mb-4 relative'>
							<h2 className=' mb-4' style={{ ...FONTS.pass_head }}>
								Edit User Information
							</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className='text-gray-500 hover:text-gray-800'
							>
								<X size={25} />
							</button>
						</div>

						<form onSubmit={handleSubmit}>
							{/* Image Upload */}
							<div className='flex flex-col gap-2 mb-6'>
								<div className='flex items-center gap-4'>
									{/* Preview */}
									<img
										src={GetImageUrl(previewImage) ?? undefined}
										// src={previewImage}
										alt='Profile Preview'
										className='w-20 h-20 object-cover rounded-lg border border-gray-300'
									/>

									{/* Custom Button */}
									<label
										htmlFor='profileImage'
										className='bg-[#68B39F] text-white px-7 py-2 rounded-tl-xl rounded-br-xl cursor-pointer hover:bg-[#5ca08d]'
									>
										Upload New Image
									</label>

									{/* Hidden File Input */}
									<input
										type='file'
										id='profileImage'
										accept='image/*'
										onChange={handleImageChange}
										className='hidden'
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4 my-6'>
								{/* First Name */}
								<div className='flex flex-col gap-4'>
									<label
										style={{ ...FONTS.edit_form }}
										htmlFor='firstName'
										className='text-sm font-medium text-gray-700'
									>
										First Name
									</label>
									<input
										id='firstName'
										value={formData.first_name}
										onChange={(e) =>
											setFormData({ ...formData, first_name: e.target.value })
										}
										placeholder='Enter first name'
										className='border border-[#999999] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68B39F] focus:border-transparent'
									/>
								</div>

								{/* Last Name */}
								<div className='flex flex-col gap-4'>
									<label
										style={{ ...FONTS.edit_form }}
										htmlFor='lastName'
										className='text-sm font-medium text-gray-700'
									>
										Last Name
									</label>
									<input
										id='lastName'
										value={formData.last_name}
										onChange={(e) =>
											setFormData({ ...formData, last_name: e.target.value })
										}
										placeholder='Enter last name'
										className='border border-[#999999] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68B39F] focus:border-transparent'
									/>
								</div>

								{/* Username */}
								<div className='flex flex-col gap-4'>
									<label
										style={{ ...FONTS.edit_form }}
										htmlFor='username'
										className='text-sm font-medium text-gray-700'
									>
										Username
									</label>
									<input
										id='username'
										value={formData.username}
										onChange={(e) =>
											setFormData({ ...formData, username: e.target.value })
										}
										placeholder='Enter username'
										className='border border-[#999999] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68B39F] focus:border-transparent'
									/>
								</div>

								{/* Email */}
								<div className='flex flex-col gap-4'>
									<label
										style={{ ...FONTS.edit_form }}
										htmlFor='email'
										className='text-sm font-medium text-gray-700'
									>
										Email
									</label>
									<input
										id='email'
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder='Enter email'
										type='email'
										className='border border-[#999999] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68B39F] focus:border-transparent'
									/>
								</div>

								{/* Contact */}
								<div className='flex flex-col gap-4'>
									<label
										style={{ ...FONTS.edit_form }}
										htmlFor='contact'
										className='text-sm font-medium text-gray-700'
									>
										Phone Number
									</label>
									<input
										id='contact'
										value={formData.phone_number}
										onChange={(e) =>
											setFormData({ ...formData, phone_number: e.target.value })
										}
										placeholder='Enter contact number'
										type='text'
										className='border border-[#999999] p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#68B39F] focus:border-transparent'
									/>
								</div>
							</div>

							<div className='flex justify-between gap-3 mt-4'>
								<button
									type='button'
									onClick={() => setIsModalOpen(false)}
									className=' border border-[#68B39F] text-[#999999] p-2 px-7 rounded-tl-xl rounded-br-xl'
								>
									Cancel
								</button>
								<button
									type='submit'
									className='bg-[#68B39F] border-transparent text-white p-2 px-7 rounded-tl-xl rounded-br-xl'
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileDetails;