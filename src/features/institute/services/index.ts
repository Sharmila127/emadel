/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from '../../../api/index';

export const getAllInstitutes = async (params?: any) => {
	try {
		const response = await Client.institute.all(params);
		if (response) {
			return response;
		}
	} catch (error) {
		console.error('Error fetching institutes:', error);
	}
};

export const getAllSubscriptions = async (params?: any) => {
	try {
		console.log(params)
		const response = await Client.subscription.get_all();
		if (response) {
			return response;
		}
	} catch (error) {
		console.error('Error fetching subscriptions:', error);
	}
};

export const getInstituteDetails = async (params: any) => {
	try {
		const response = await Client.institute.getWithId(params)
		if (response) {
			return response;
		}
	}
	catch (error) {
		console.error('Error fetching for Institute:', error)
	}
}

export const createInstitute = async (data: any) => {
	try {
		const response = await Client.institute.create(data);
		if (response) {
			return response;
		}
	} catch (error) {
		console.error('Error:', error);
	}
};
export const getCourseDetails = async (params: any) => {
	try {
		const response = await Client.institute.getCourseList(params)
		if (response) {
			return response;
		}
	}
	catch (error) {
		console.log(error)
	}
}

export const getActivitylogDetails = async (params: any) => {
	try {
		const response = await Client.activity.get(params)
		if (response) {
			return response
		}
	}
	catch (error) {
		console.log('error', error)
	}
}

export const updateInstituteDetails = async (data: any) => {
	try {
		const response = await Client.institute.update(data)
		if (response) {
			return response
		}
	}
	catch (error) {
		console.log(error, 'error')
	}
}