 
import { getPaymentService } from '../Services';
import { getPayment } from './slices';

export const getPaymentThunks = (params:any) => async(dispatch:any)  =>
    {
        try {
            const response = await getPaymentService(params);
            if (response) {
                dispatch(getPayment(response?.data?.data));
            }      
        } catch (error) {
            console.log(error);
            return null;
        }
}