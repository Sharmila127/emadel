import { getAllInstitutes } from '../services';
import { getInstitutes } from './slices';

export const getInstitutesData = (params?: any) => async (dispatch: any) => {
	try {
		const response = await getAllInstitutes(params);
		if (response) {
			dispatch(getInstitutes(response?.data?.data));
		}
	} catch (error) {
		console.error('Error fetching institutes data:', error);
	}
};
