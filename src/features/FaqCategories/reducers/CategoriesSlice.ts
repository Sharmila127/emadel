import { createSlice } from '@reduxjs/toolkit';

const FaqCategoriesSlice = createSlice({
    name: 'FAqCategoriesSlice',
    initialState: {
        data: [],
    },
    reducers: {
        getCategories: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { getCategories } = FaqCategoriesSlice.actions;
export default FaqCategoriesSlice.reducer;