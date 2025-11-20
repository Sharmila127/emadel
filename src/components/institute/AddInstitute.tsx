/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Upload, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { COLORS, FONTS } from '@/constants/ui constants';
import uploadImg from '../../assets/institute/upload.png';
import {
	createInstitute,
	getAllSubscriptions,
} from '@/features/institute/services';
import { fetchCities, fetchCountries, fetchStates } from '@/utils/locationApi';
import { UploadImage, UploadMultipleImages } from '@/utils/helper';

interface FormData {
	// Personal Info
	institute_name: string;
	registeredCode: string;
	description: string;
	addressLine1: string;
	addressLine2: string;
	phoneNumber: string;
	altPhoneNumber: string;
	contact: string;
	state: string;
	city: string;
	pinCode: string;
	officialEmail: string;
	officialWebsite: string;
	subscription: string;
	// Gallery Info
	instituteLogo: any;
	logoDescription: string;
	instituteImage: any;
	imageDescription: string;
	instituteLogoSecond: any;
	galleryImages: any;
	// Social Links
	twitter: string;
	facebook: string;
	instagram: string;
	linkedin: string;
	pinterest: string;
	// Documents
	gstNumber: string;
	panNumber: string;
	licenseNumber: string;
	gstFile: any;
	panFile: any;
	licenseFile: any;
	// Account Details
	branchName: string;
	branch_phone: string;
	branch_altphone: string;
	branch_addressLine1: string;
	branch_addressLine2: string;
	country: string;
	stateBranch: string;
	cityBranch: string;
	pinCodeBranch: string;
	fullName: string;
	lastName: string;
	email: string;
	branch_phonenumber: string;
	profileImage: any;
}

const FileUploadBox = ({
	field,
	title,
	description,
	file,
	files,
	multiple = false,
	onFileChange,
	onFilesChange,
}: {
	field: keyof FormData;
	title: string;
	description: string;
	file?: File | null;
	files?: File[] | null;
	multiple?: boolean;
	onFileChange?: (
		field: keyof FormData
	) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	onFilesChange?: (
		field: keyof FormData
	) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const id = `file-${field}`;
	return (
		<div className='space-y-2'>
			<Label className='mb-4' style={{ ...FONTS.text5, color: COLORS.black }}>
				{title}
			</Label>
			<div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors'>
				<input
					type='file'
					onChange={multiple ? onFilesChange?.(field) : onFileChange?.(field)}
					className='hidden'
					id={id}
					accept='image/*'
					multiple={multiple}
				/>
				<label htmlFor={id} className='cursor-pointer'>
					<Upload className='w-8 h-8 mx-auto mb-2 text-gray-400' />
					<p className='mb-1 text-gray-600' style={{ ...FONTS.sub_text }}>
						Drag & Drop Or Click To Upload
					</p>
					<p
						className='text-xs text-gray-400'
						style={{ ...FONTS.sub_text, fontSize: '12px' }}
					>
						{description}
					</p>
					{!multiple && file && (
						<p className='text-sm text-teal-600 mt-2'>{file.name}</p>
					)}
					{multiple && files && (
						<div className='mt-2 space-y-1'>
							{files.map((f, i) => (
								<p key={i} className='text-sm text-teal-600'>
									{f.name}
								</p>
							))}
						</div>
					)}
				</label>
			</div>
		</div>
	);
};

const InputField = ({
	label,
	field,
	type = 'text',
	placeholder = '',
	className = '',
	value,
	onChange,
}: {
	label: string;
	field: keyof FormData;
	type?: string;
	placeholder?: string;
	className?: string;
	value: string;
	onChange: (field: keyof FormData, value: string) => void;
}) => {
	const id = `input-${field}`;
	return (
		<div className={className}>
			<Label
				htmlFor={id}
				className='mb-4'
				style={{ ...FONTS.text5, color: COLORS.black }}
			>
				{label}
			</Label>
			<Input
				id={id}
				type={type}
				value={value}
				style={{ ...FONTS.text4, color: COLORS.gray_01 }}
				onChange={(e) => onChange(field, e.target.value)}
				placeholder={placeholder}
				className='mt-1'
			/>
		</div>
	);
};

const TextareaField = ({
	label,
	field,
	rows = 3,
	className = '',
	value,
	onChange,
}: {
	label: string;
	field: keyof FormData;
	rows?: number;
	className?: string;
	value: string;
	onChange: (field: keyof FormData, value: string) => void;
}) => {
	const id = `textarea-${field}`;
	return (
		<div className={className}>
			<Label
				htmlFor={id}
				className='text-sm font-medium text-gray-700 mb-4'
				style={{ ...FONTS.text5, color: COLORS.black }}
			>
				{label}
			</Label>
			<Textarea
				id={id}
				value={value}
				style={{ ...FONTS.text4, color: COLORS.gray_01 }}
				onChange={(e) => onChange(field, e.target.value)}
				className='mt-1'
				rows={rows}
			/>
		</div>
	);
};

const StepperForm: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<FormData>({
		institute_name: '',
		registeredCode: '',
		description: '',
		addressLine1: '',
		addressLine2: '',
		phoneNumber: '',
		altPhoneNumber: '',
		contact: '',
		state: '',
		city: '',
		pinCode: '',
		officialEmail: '',
		officialWebsite: '',
		subscription: '',
		instituteLogo: "",
		logoDescription: '',
		instituteImage: "",
		imageDescription: '',
		instituteLogoSecond: "",
		galleryImages: [],
		twitter: '',
		facebook: '',
		instagram: '',
		linkedin: '',
		pinterest: '',
		gstNumber: '',
		panNumber: '',
		licenseNumber: '',
		gstFile: "",
		panFile: "",
		licenseFile: "",
		branchName: '',
		branch_altphone: '',
		branch_addressLine1: '',
		branch_addressLine2: '',
		country: '',
		stateBranch: '',
		cityBranch: '',
		pinCodeBranch: '',
		fullName: '',
		lastName: '',
		email: '',
		branch_phonenumber: '',
		profileImage: "",
		branch_phone: ""
	});
	const [allSubscriptions, setAllSubscriptions] = useState<any[]>([]);

	const steps = [
		{ id: 1, title: 'Personal Info', number: '1' },
		{ id: 2, title: 'Gallery Info', number: '2' },
		{ id: 3, title: 'Social Links', number: '3' },
		{ id: 4, title: 'Documents', number: '4' },
		{ id: 5, title: 'Account Details', number: '5' },
	];

	const fetchAllSubscriptions = async () => {
		try {
			const response = await getAllSubscriptions();
			if (response) {
				setAllSubscriptions(response?.data?.data || []);
			}
		} catch (error) {
			console.error('Error fetching subscriptions:', error);
		}
	};

	useEffect(() => {
		fetchAllSubscriptions();
	}, []);

	const [countries, setCountries] = useState<any[]>([]);
	const [states, setStates] = useState<any[]>([]);
	const [cities, setCities] = useState<any[]>([]);
	const [branchStates, setBranchStates] = useState<any[]>([]);
	const [branchCities, setBranchCities] = useState<any[]>([]);
	const [loadingCountries, setLoadingCountries] = useState(false);
	const [loadingStates, setLoadingStates] = useState(false);
	const [loadingCities, setLoadingCities] = useState(false);
	const [loadingBranchStates, setLoadingBranchStates] = useState(false);
	const [loadingBranchCities, setLoadingBranchCities] = useState(false);

	useEffect(() => {
		const loadCountries = async () => {
			setLoadingCountries(true);
			const data = await fetchCountries();
			setCountries(data);
			setLoadingCountries(false);
		};
		loadCountries();
	}, []);

	const handleCountryChange = async (value: string, isBranch = false) => {
		handleInputChange(isBranch ? 'country' : 'state', value);
		if (isBranch) {
			setLoadingBranchStates(true);
			const data = await fetchStates(value);
			setBranchStates(data);
			setLoadingBranchStates(false);
			handleInputChange('stateBranch', '');
			handleInputChange('cityBranch', '');
			setBranchCities([]);
		} else {
			setLoadingStates(true);
			const data = await fetchStates(value);
			setStates(data);
			setBranchStates(data);
			setLoadingStates(false);
			handleInputChange('state', '');
			handleInputChange('city', '');
			setCities([]);
		}
	};

	const handleStateChange = async (
		value: string,
		countryCode: string,
		isBranch = false
	) => {
		handleInputChange(isBranch ? 'stateBranch' : 'state', value);
		if (isBranch) {
			setLoadingBranchCities(true);
			const data = await fetchCities(countryCode, value);
			setBranchCities(data);
			setLoadingBranchCities(false);
			handleInputChange('cityBranch', '');
		} else {
			setLoadingCities(true);
			const data = await fetchCities(countryCode, value);
			setCities(data);
			setLoadingCities(false);
			handleInputChange('city', '');
		}
	};

	const handleInputChange = useCallback(
		(field: keyof FormData, value: any) => {
			setFormData((prev) => ({
				...prev,
				[field]: value,
			}));
		},
		[]
	);

	const handleFileUpload = useCallback(
		(field: keyof FormData) =>
			async (event: React.ChangeEvent<HTMLInputElement>) => {
				const files = event.target.files;
				if (!files || files.length === 0) return;

				if (field === 'galleryImages') {
					// Handle multiple files for galleryImages
					const fileList = Array.from(files);
					console.log(`Files selected for ${field}:`, fileList);

					try {
						const formData = new FormData();
						fileList.forEach((file) => {
							formData.append('files', file);
						});

						const response = await UploadMultipleImages(formData);
						handleInputChange(field, response?.data?.data?.file);
						console.log(`Files uploaded for ${field}:`, response);
						if (response) {
							toast.success(
								`${fileList.length} files uploaded successfully for ${field}`
							);
						}
					} catch (error) {
						toast.error(`Error uploading files for ${field}: ${error}`);
					}
				} else {
					const file = files[0];
					if (file) {
						const fileData = new FormData();
						fileData.append('file', file);
						try {
							const response: any = await UploadImage(fileData);
							console.log(response, "upload ress")
							handleInputChange(field, response?.data?.data?.file);
							if (response) {
								toast.success(`File uploaded successfully for ${field}`);
							}
						} catch (error) {
							toast.error(`Error uploading file for ${field}: ${error}`);
						}
					}
				}
			},
		[handleInputChange]
	);


	const nextStep = async () => {
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		} else {
			console.log('Institute Data:', formData);
			try {
				const data = {
					institute: {
						institute_name: formData?.institute_name,
						email: formData?.email,
						subscription: formData?.subscription,
						contact_info: {
							phone_no: formData?.phoneNumber,
							alternate_no: formData?.altPhoneNumber,
							address: {
								address1: formData?.branch_addressLine1,
								address2: formData?.branch_addressLine2,
								state: states.forEach((state) => {
									if (state.iso2 === formData.state) {
										return state.name
									}
								}),
								city: cities.forEach((city) => {
									if (city.iso2 === formData.city) {
										return city.name
									}
								}),
								pincode: formData?.pinCode,
							}
						},
						website: formData?.officialWebsite,
						description: formData?.description,
						logo: formData?.instituteLogo,
						image: formData?.profileImage,
						gallery_images: formData?.galleryImages,
						docs: {
							gst: {
								number: formData?.gstNumber,
								file: formData?.gstFile,
							},
							pan: {
								number: formData?.panNumber,
								file: formData?.panFile
							},
							licence: {
								number: formData?.licenseNumber,
								file: formData?.licenseFile
							}
						},
						social_media: {
							twitter_id: formData?.twitter,
							facebook_id: formData?.facebook,
							instagram_id: formData?.instagram,
							linkedin_id: formData?.linkedin,
							pinterest: formData?.pinterest,
						},
					},
					branch: {
						branch_identity: formData?.branchName,
						contact_info: {
							phone_no: formData.branch_phonenumber,
							alternate_no: formData.branch_altphone,
							address: formData.branch_addressLine1,
							landmark: formData.branch_addressLine2,
							state: states.forEach((state) => {
								if (state.iso2 === formData.stateBranch) {
									return state.name
								}
							}),
							city: cities.forEach((city) => {
								if (city.iso2 === formData.cityBranch) {
									return city.name
								}
							}),
							pincode: formData.pinCodeBranch
						}
					},
					admin: {
						first_name: formData.fullName,
						last_name: formData.lastName,
						username: "admin",
						phone_number: formData.phoneNumber,
						email: formData.email,
						image: formData.instituteLogo,
					}
				}
				const response = await createInstitute(data);
				if (response) {
					toast.success('Institute added successfully');
					navigate('/institute');
				} else {
					toast.error('Failed to add institute');
				}
			} catch (error: any) {
				console.log(error)
				toast.error('Failed to add institute');
			}
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const DropdownField = ({
		label,
		field,
		options,
		loading = false,
		className = '',
		value,
		onChange,
	}: {
		label: string;
		field: keyof FormData;
		options: { _id?: string; iso2?: string; name: string }[];
		loading?: boolean;
		className?: string;
		value: string;
		onChange: (field: keyof FormData, value: string) => void;
	}) => {
		const id = `select-${field}`;
		return (
			<div className={className}>
				<Label
					htmlFor={id}
					className='text-sm font-medium text-gray-700 mb-4'
					style={{ ...FONTS.text5, color: COLORS.black }}
				>
					{label}
				</Label>
				<select
					id={id}
					value={value}
					onChange={(e) => onChange(field, e.target.value)}
					className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
					style={{ ...FONTS.text4, color: COLORS.gray_01 }}
					disabled={loading}
				>
					<option value=''>Select {label}</option>
					{options?.map((option) => (
						<option
							key={option?.iso2 || option?.name}
							value={option?._id ?? option?.iso2}
						>
							{option?.name}
						</option>
					))}
				</select>
			</div>
		);
	};

	const StepHeader = () => (
		<div className='flex items-center justify-center mb-8 space-x-4'>
			{steps?.map((step) => (
				<div key={step.id} className='flex flex-col items-center gap-3'>
					<div
						className={`w-42 h-44 rounded-lg flex flex-col items-center justify-center gap-4 ${currentStep === step.id
							? '!bg-[#2D6974]'
							: currentStep > step.id
								? '!bg-[#2D6974]'
								: ''
							}`}
					>
						<div
							className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium ${currentStep === step.id
								? '!bg-white !text-[#2D6974]'
								: currentStep > step.id
									? '!bg-white !text-[#2D6974]'
									: '!bg-[#999999] !text-white'
								}`}
							style={{ ...FONTS.percentage_text }}
						>
							{currentStep > step.id ? (
								<Check className='w-6 h-6' />
							) : (
								step.number
							)}
						</div>
						<div className='ml-2 text-center'>
							<div
								className={`${currentStep === step.id
									? '!text-white'
									: currentStep > step.id
										? '!text-white'
										: '!text-[#999999]'
									}`}
								style={{ ...FONTS.tableheader }}
							>
								{step.title}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);

	const renderStepContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className='space-y-6'>
						<div>
							<h2
								className='text-2xl font-bold text-gray-800 mb-2'
								style={{ ...FONTS.heading }}
							>
								Personal Info
							</h2>
							<p className='text-gray-600 mb-6' style={{ ...FONTS.edit_form }}>
								Add Logo Image, Gallery Information
							</p>
						</div>
						<Card className='p-4 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Enter your Institute Details Here
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InputField
									label='Institute Name'
									field='institute_name'
									value={formData.institute_name}
									onChange={handleInputChange}
								/>
								<InputField
									label='Registered Code'
									field='registeredCode'
									value={formData.registeredCode}
									onChange={handleInputChange}
								/>
							</div>
							<TextareaField
								label='Description'
								field='description'
								className='mt-4'
								value={formData.description}
								onChange={handleInputChange}
							/>
						</Card>
						<Card className='p-4 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Enter your Address Information Here
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InputField
									label='Address Line 1'
									field='addressLine1'
									value={formData.addressLine1}
									onChange={handleInputChange}
								/>
								<InputField
									label='Address Line 2'
									field='addressLine2'
									value={formData.addressLine2}
									onChange={handleInputChange}
								/>
								<InputField
									label='Phone Number'
									field='phoneNumber'
									type='tel'
									placeholder='eg: +91xxxxxxxx'
									value={formData.phoneNumber}
									onChange={handleInputChange}
								/>
								<InputField
									label='Alt Phone Number'
									field='altPhoneNumber'
									type='tel'
									placeholder='eg: +91xxxxxxxx'
									value={formData.altPhoneNumber}
									onChange={handleInputChange}
								/>
								<DropdownField
									label='Country'
									field='country'
									options={countries}
									loading={loadingCountries}
									value={formData.country}
									onChange={(field, value) => { handleCountryChange(value); handleInputChange(field, value) }}
								/>
								{states?.length > 0 && (
									<DropdownField
										label='State'
										field='state'
										options={states}
										loading={loadingStates}
										value={formData.state}
										onChange={(field, value) => { handleStateChange(value, formData.country); handleInputChange(field, value) }}
									/>
								)}
								{cities?.length > 0 && (
									<DropdownField
										label='City'
										field='city'
										options={cities}
										loading={loadingCities}
										value={formData.city}
										onChange={handleInputChange}
									/>
								)}
								{/* <DropdownField
									label='Country'
									field='country'
									options={countries}
									loading={loadingCountries}
									value={formData.country}
									onChange={(value) => handleCountryChange(value, true)}
								/>
								{branchStates?.length > 0 && (
									<DropdownField
										label='State'
										field='stateBranch'
										options={branchStates}
										loading={loadingBranchStates}
										value={formData.stateBranch}
										onChange={(value) =>
											handleStateChange(value, formData.country, true)
										}
									/>
								)}
								{branchCities?.length > 0 && (
									<DropdownField
										label='City'
										field='cityBranch'
										options={branchCities}
										loading={loadingBranchCities}
										value={formData.cityBranch}
										onChange={handleInputChange}
									/>
								)} */}
								<InputField
									label='Pin code'
									field='pinCode'
									value={formData.pinCode}
									onChange={handleInputChange}
								/>
							</div>
						</Card>
						<Card className='p-4 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Enter your Contact Details Here
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InputField
									label='Official Email'
									field='officialEmail'
									type='email'
									value={formData.officialEmail}
									onChange={handleInputChange}
								/>
								<InputField
									label='Official Website'
									field='officialWebsite'
									value={formData.officialWebsite}
									onChange={handleInputChange}
								/>
							</div>
						</Card>
						<Card className='p-4 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Enter your Subscription Information Here
							</h3>
							<DropdownField
								label='Subscription'
								field='subscription'
								options={
									allSubscriptions && allSubscriptions?.length > 0
										? allSubscriptions?.map((sub) => ({
											name: sub?.identity,
											_id: sub?._id
										}))
										: []
								}
								value={formData.subscription}
								onChange={handleInputChange}
								className='mt-4'
							/>
						</Card>
					</div>
				);
			case 2:
				return (
					<div className='space-y-6'>
						<div>
							<h2
								className='text-2xl font-bold text-gray-800 mb-2'
								style={{ ...FONTS.heading }}
							>
								Gallery Info
							</h2>
							<p className='text-gray-600 mb-6' style={{ ...FONTS.edit_form }}>
								Add Gallery Info
							</p>
						</div>
						<div className='space-y-6'>
							<Card className='p-4 shadow-md'>
								<FileUploadBox
									field='instituteLogo'
									title='Institute Logo'
									description='Upload your brand or logo logo Size 300X300 px (Max 80 kb)'
									file={formData.instituteLogo}
									onFileChange={handleFileUpload}
								/>
							</Card>
							<Card className='p-4 shadow-md'>
								<FileUploadBox
									field='instituteImage'
									title='Institute Image'
									description='Upload your institute image Size 300X300 px (Max 1 Mb)'
									file={formData.instituteImage}
									onFileChange={handleFileUpload}
								/>
							</Card>
							<Card className='p-4 shadow-md'>
								<FileUploadBox
									field='galleryImages'
									title='Gallery Images'
									description='Upload your institute gallery images Size 300X300 px (Max 1 Mb)'
									files={formData.galleryImages}
									multiple={true}
									onFilesChange={handleFileUpload}
								/>
							</Card>
						</div>
					</div>
				);
			case 3:
				return (
					<div className='space-y-6'>
						<div>
							<h2
								className='text-2xl font-bold text-gray-800 mb-2'
								style={{ ...FONTS.heading }}
							>
								Social Links
							</h2>
							<p className='text-gray-600 mb-6' style={{ ...FONTS.edit_form }}>
								Add Social Links
							</p>
						</div>
						<Card className='p-4 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Give your Social Links Here
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InputField
									label='Twitter'
									field='twitter'
									placeholder='https://twitter.com/username'
									value={formData.twitter}
									onChange={handleInputChange}
								/>
								<InputField
									label='Facebook'
									field='facebook'
									placeholder='https://facebook.com/username'
									value={formData.facebook}
									onChange={handleInputChange}
								/>
								<InputField
									label='Instagram'
									field='instagram'
									placeholder='https://instagram.com/username'
									value={formData.instagram}
									onChange={handleInputChange}
								/>
								<InputField
									label='Linkedin'
									field='linkedin'
									placeholder='https://linkedin.com/in/username'
									value={formData.linkedin}
									onChange={handleInputChange}
								/>
							</div>
							<InputField
								label='Pinterest'
								field='pinterest'
								placeholder='https://pinterest.com/username'
								className='mt-4'
								value={formData.pinterest}
								onChange={handleInputChange}
							/>
						</Card>
					</div>
				);

			case 4:
				return (
					<div className='space-y-6'>
						<div>
							<h2
								className='text-2xl font-bold text-gray-800 mb-2'
								style={{ ...FONTS.heading }}
							>
								Documents
							</h2>
							<p className='text-gray-600 mb-6' style={{ ...FONTS.edit_form }}>
								Add Institute Docs
							</p>
						</div>

						<div className='space-y-6'>
							{/* GST */}
							<Card className='p-4 shadow-md relative'>
								<h3
									className=' mb-4'
									style={{ ...FONTS.tableheader, color: COLORS.secondary }}
								>
									GST Information
								</h3>
								<div className='flex items-center gap-4'>
									<div className='flex flex-1 justify-between items-center'>
										<InputField
											label='GST Number'
											field='gstNumber'
											className='w-[70%]'
											value={formData.gstNumber}
											onChange={handleInputChange}
										/>
										<label className='flex items-center gap-2 px-4 py-2 bg-[#E0ECDE] border rounded-lg cursor-pointer hover:bg-[#E0ECDE] w-52 h-10 justify-center'>
											<img
												src={uploadImg}
												alt='upload image'
												className='w-6 h-6'
											/>
											<input
												type='file'
												className='hidden'
												accept='.pdf,.jpg,.jpeg,.png'
												onChange={handleFileUpload('gstFile')}
											/>
											<span style={{ ...FONTS.text4, color: COLORS.button }}>
												GST Document
											</span>
										</label>
									</div>
								</div>
								{formData.gstFile && (
									<div className='absolute right-15 bottom-22'>
										<p style={{ ...FONTS.small_text }}>
											{formData.gstFile?.includes("staticfiles/eflow") ? 'file uploaded success' : 'upload failed try again..'}
										</p>
									</div>
								)}
							</Card>

							{/* PAN */}
							<Card className='p-4 shadow-md relative'>
								<h3
									className=' mb-4'
									style={{ ...FONTS.tableheader, color: COLORS.secondary }}
								>
									PAN Information
								</h3>
								<div className='flex items-center gap-4'>
									<div className='flex flex-1 justify-between items-center'>
										<InputField
											label='PAN Number'
											field='panNumber'
											className='w-[70%]'
											value={formData.panNumber}
											onChange={handleInputChange}
										/>
										<label className='flex items-center gap-2 px-4 py-2 bg-[#E0ECDE] border rounded-lg cursor-pointer hover:bg-[#E0ECDE] w-52 h-10 justify-center'>
											<img
												src={uploadImg}
												alt='upload image'
												className='w-6 h-6'
											/>
											<input
												type='file'
												className='hidden'
												accept='.pdf,.jpg,.jpeg,.png'
												onChange={handleFileUpload('panFile')}
											/>
											<span style={{ ...FONTS.text4, color: COLORS.button }}>
												PAN Document
											</span>
										</label>
									</div>
								</div>
								{formData.panFile && (
									<div className='absolute right-15 bottom-22'>
										<p style={{ ...FONTS.small_text }}>
											{formData.panFile?.includes("staticfiles/eflow") ? 'file uploaded success' : 'upload failed try again..'}
										</p>
									</div>
								)}
							</Card>

							{/* License */}
							<Card className='p-4 shadow-md relative'>
								<h3
									className=' mb-4'
									style={{ ...FONTS.tableheader, color: COLORS.secondary }}
								>
									License Information
								</h3>
								<div className='flex items-center gap-4'>
									<div className='flex flex-1 justify-between items-center'>
										<InputField
											label='License Number'
											className='w-[70%]'
											field='licenseNumber'
											value={formData.licenseNumber}
											onChange={handleInputChange}
										/>
										<label className='flex items-center gap-2 px-4 py-2 bg-[#E0ECDE] border rounded-lg cursor-pointer hover:bg-[#E0ECDE] w-52 h-10 justify-center'>
											<img
												src={uploadImg}
												alt='upload image'
												className='w-6 h-6'
											/>
											<input
												type='file'
												className='hidden'
												accept='.pdf,.jpg,.jpeg,.png'
												onChange={handleFileUpload('licenseFile')}
											/>
											<span style={{ ...FONTS.text4, color: COLORS.button }}>
												License Document
											</span>
										</label>
									</div>
								</div>
								{formData.licenseFile && (
									<div className='absolute right-15 bottom-22'>
										<p style={{ ...FONTS.small_text }}>
											{formData.licenseFile?.includes("staticfiles/eflow") ? 'file uploaded success' : 'upload failed try again..'}
										</p>
									</div>
								)}
							</Card>
						</div>
					</div>
				);

			case 5:
				return (
					<div className='space-y-6'>
						<div>
							<h2
								className='text-2xl font-bold text-gray-800 mb-2'
								style={{ ...FONTS.heading }}
							>
								Account Details
							</h2>
							<p className='text-gray-600 mb-6' style={{ ...FONTS.edit_form }}>
								Enter your Account Details
							</p>
						</div>
						<Card className='p-6 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Enter your Branch Details Here
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InputField
									label='Branch Name'
									field='branchName'
									value={formData.branchName}
									onChange={handleInputChange}
								/>
								<InputField
									label='Phone'
									field='branch_phonenumber'
									placeholder='eg: +91xxxxxxxx'
									type='tel'
									value={formData.branch_phonenumber}
									onChange={handleInputChange}
								/>
								<InputField
									label='Alternative Phone'
									field='branch_altphone'
									placeholder='eg: +91xxxxxxxx'
									type='tel'
									value={formData.branch_altphone}
									onChange={handleInputChange}
								/>
								<InputField
									label='Address Line 1'
									field='branch_addressLine1'
									value={formData.branch_addressLine1}
									onChange={handleInputChange}
								/>
								<InputField
									label='Address Line 2'
									field='branch_addressLine2'
									value={formData.branch_addressLine2}
									onChange={handleInputChange}
								/>

								{/* Country Dropdown */}
								<DropdownField
									label='Country'
									field='country'
									options={countries}
									loading={loadingCountries}
									value={formData.country}
									onChange={(field, value) => { handleCountryChange(value, true); handleInputChange(field, value) }}
								/>

								{/* State Dropdown (only shown when country is selected) */}
								{branchStates.length > 0 && (
									<DropdownField
										label='State'
										field='stateBranch'
										options={branchStates}
										loading={loadingBranchStates}
										value={formData.stateBranch}
										onChange={(field, value) => {
											handleStateChange(value, formData.country, true);
											handleInputChange(field, value)
										}
										}
									/>
								)}

								{/* City Dropdown (only shown when state is selected) */}
								{formData.stateBranch && branchCities.length > 0 && (
									<DropdownField
										label='City'
										field='cityBranch'
										options={branchCities}
										loading={loadingBranchCities}
										value={formData.cityBranch}
										onChange={handleInputChange}
									/>
								)}

								<InputField
									label='Pin Code'
									field='pinCodeBranch'
									value={formData.pinCodeBranch}
									onChange={handleInputChange}
								/>
							</div>
						</Card>
						<Card className='p-4 shadow-md'>
							<h3
								className='font-semibold text-gray-700 mb-4'
								style={{ ...FONTS.tableheader, color: COLORS.secondary }}
							>
								Enter your Contact Details Here
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<InputField
									label='Full Name'
									field='fullName'
									value={formData.fullName}
									onChange={handleInputChange}
								/>
								<InputField
									label='Last Name'
									field='lastName'
									value={formData.lastName}
									onChange={handleInputChange}
								/>
								<InputField
									label='Email'
									field='email'
									type='email'
									value={formData.email}
									onChange={handleInputChange}
								/>
								<InputField
									label='Phone Number'
									field='branch_phone'
									type='tel'
									value={formData.branch_phone}
									onChange={handleInputChange}
								/>
							</div>
							<div className='mt-4'>
								<Label
									className='text-sm font-medium text-gray-700 mb-4'
									style={{ ...FONTS.text5 }}
								>
									Profile Image
								</Label>
								<div className='flex items-center gap-4'>
									<label className='flex items-center gap-2 px-4 py-2 bg-[#E0ECDE] border rounded-lg cursor-pointer hover:bg-[#E0ECDE] w-52 h-10 justify-center'>
										<img
											src={uploadImg}
											alt='upload image'
											className='w-6 h-6'
										/>
										<input
											type='file'
											className='hidden'
											accept='image/*'
											onChange={handleFileUpload('profileImage')}
										/>
										<span style={{ ...FONTS.text4, color: COLORS.button }}>
											Upload Image
										</span>
									</label>
									{formData.profileImage && (
										<p style={{ ...FONTS.small_text }}>
											{formData?.profileImage?.name?.substring(0, 20)}
										</p>
									)}
								</div>
							</div>
						</Card>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className='min-h-screen  py-8'>
			<div className=' mx-auto px-4'>
				<StepHeader />
				<div className=''>
					<div className='p-8'>
						{renderStepContent()}
						<div className='flex justify-between mt-8'>
							<Button
								variant='outline'
								onClick={prevStep}
								disabled={currentStep === 1}
								className='border-[#2D6974] text-[#2D6974] rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none px-4 py-5 w-28'
							>
								Back
							</Button>
							<Button
								onClick={nextStep}
								className='bg-[#2D6974] text-white hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none px-4 py-5 w-28'
							>
								{currentStep === 5 ? 'Complete' : 'Next'}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StepperForm;
