import { getActivityData, getProfileData } from '../services'; 
import { getActivity, getProfile } from './ProfileSlice';

export const getProfileThunks =
    (params:any) => async (dispatch: any) => {
        try {
            const response:any = await getProfileData(params);
            dispatch(getProfile(response.data.data));
            console.log(response.data.data,"Profile Response")
            return response
        } catch (error) {
            console.log(error);
        }
    };


export const getActivityThunks =
    (params:any) => async (dispatch: any) => {
        try {
            const response:any = await getActivityData(params);
            dispatch(getActivity(response.data.data));
            console.log(response.data.data,"Activity Response")
            return response
        } catch (error) {
            console.log(error);
        }
    };  