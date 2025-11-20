import Client from '../api/index';

const backendurl = import.meta.env.VITE_PUBLIC_API_URL;

export const GetImageUrl = (url: string) => {
	const data = url ? backendurl + '/' + url : null;
	return data;
};

export const UploadImage = async (data: any) => {
	try {
		const response = await Client.file.upload(data);
		if (response) {
			return response;
		}
	} catch (error) {
		console.error('Error uploading image:', error);
		return null;
	}
};

export const UploadMultipleImages = async (data: any) => {
	try {
		const response = await Client.file.uploads(data);
		if (response) {
			return response;
		}
	} catch (error) {
		console.error('Error uploading image:', error);
		return null;
	}
};
