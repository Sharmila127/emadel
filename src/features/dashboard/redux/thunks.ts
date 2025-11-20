/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppDispatch } from "@/store";
import { GetDashboardDetails } from "../service";
import { setDashboardData } from "./slice";

export const GetDashboardThunks = (params: any) => async (dispatch: AppDispatch) => {
    try {
        const response = await GetDashboardDetails(params)
        dispatch(setDashboardData(response))
        return response
    } catch (error) {
        console.log(error, "dashboardThunk errror")
    }
}