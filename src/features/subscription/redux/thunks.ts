/* eslint-disable @typescript-eslint/no-explicit-any */

import { GetAllSubscription } from "../services";
import { getSubscription } from "./reduxSlice";

export const GettingAllSubscriptionThunks = () => async (dispatch: any) => {
  try {
    const response = await GetAllSubscription();
    const result = response?.data || [];
    dispatch(getSubscription(result));
    return result;
  } catch (error) {
    console.log("Error in GetAllSubscription Thunks:", error);
  }
};
