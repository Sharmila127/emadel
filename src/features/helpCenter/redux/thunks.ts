/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppDispatch } from "@/store";
import { createHelpCeterService, getAllHelpCenterService } from "../service";
import { UpdateAndAddHelp, getAllHelp } from "./slice";


export const CreatehelpCenterThunks = (data: any) => async (dispatch: AppDispatch) => {
    try {
        const response = await createHelpCeterService(data)
        dispatch(UpdateAndAddHelp(response?.data))
        return response
    } catch (error) {
        console.warn(error)
    }
}

export const getAllHelpCenterThunks = () => async (dispatch: AppDispatch) => {
    try {
        const response = await getAllHelpCenterService()
        dispatch(getAllHelp(response?.data))
    } catch (error) {
        console.warn(error)
    }
}