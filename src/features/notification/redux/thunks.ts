/* eslint-disable @typescript-eslint/no-explicit-any */
import { creatNotification, GetAllBranch, GetAllInstitute, GetAllNotification } from "../sevice";
import { getBranch, getInstitute, getNotification } from "./reduxSlice";



export const GetAllNotificationThunks = (params: any) => async (dispatch: any) => {
  try {
    const response = await GetAllNotification(params);
    const notificationsArray = response?.data?.data?.data || [];
    dispatch(getNotification(notificationsArray));
    // console.log("Notification data in thunks", notificationsArray);
    return { payload: notificationsArray };
  } catch (error) {
    console.log("Error in GetAllNotification Thunks:", error);
  }
};


export const GetAllInstituteThunks = (params?: any) => async (dispatch: any) => {
  try {
    const response = await GetAllInstitute(params);
    // console.log(response, "institute id");
    dispatch(getInstitute(response.data));
    return { payload: response.data };
  } catch (error) {
    console.error("Error in GetAllInstituteThunks:", error);
  }
};



export const GetAllBranchThunks = (params: { institute: any }) => async (dispatch: any) => {
  try {
    const response = await GetAllBranch(params);
    dispatch(getBranch(response.data));
    console.log("Branch data in thunks", response);
    return { payload: response };
  } catch (error) {
    console.log("Error in GetAllBranch Thunks:", error);
  }
};

export const CreatNotificationThunks = (params: any) => async (dispatch: any) => {
  try {
    const response = await creatNotification(params);
    dispatch(getNotification(response));
    console.log(" Creat Notification", response);
    return { payload: response };
  } catch (error) {
    console.log("Error in CreatNotification Thunks:", error);
  }
};

