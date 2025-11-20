import { getHelpCenterTicketDataset } from "../services";
import { getHelpcenterTicket } from "./HelpcenterTicketSlice";

export const getHelpcenterTicketData = (data: any) => async(dispatch: any) => {
    try {
        const response = await getHelpCenterTicketDataset(data);
        if (response) {
            dispatch(getHelpcenterTicket(response?.data));
        }
    } catch (error) {
        console.log(error);
        
    }
}