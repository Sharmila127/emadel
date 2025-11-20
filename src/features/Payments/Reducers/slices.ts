import { createSlice } from '@reduxjs/toolkit';

const PaymentSlice = createSlice({
    name: 'PaymentSlice',
    initialState: {
        payment: [],
    },
    reducers: {
        getPayment: (state, action) => {
            state.payment = action.payload;
        },
    },
});

export const { getPayment } = PaymentSlice.actions;
export default PaymentSlice.reducer;
