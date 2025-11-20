import Client from '../../../api/index';

export const getProfileData = async (params: any) => {
    const response = await Client.auth.get_profile(params)
    if (response) {
        return response;
    }
};

export const getActivityData = async (params: any) => {
    const response = await Client.activity.get(params)
    if (response) {
        return response;
    }
};

export const updateProfile = async (params: any) => {
    const response = await Client.auth.edit_profile(params)
    if (response) {
        return response;
    }
};

export const updatePassword = async (params: any) => {
    const response = await Client.auth.update_password(params)
    if (response) {
        return response;
    }
};

export const fileupload = async (params:any) => {
    const response = await Client.file.upload(params)
    if (response) {
        return response;
    }
};