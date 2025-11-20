import { createSlice } from '@reduxjs/toolkit';

const ProfileSlice = createSlice({
    name: 'ProfileSlice',
    initialState: {
        data: [],
        activity:[]
    },
    reducers: {
        getProfile: (state, action) => {
            state.data = action.payload;
        },
        getActivity:(state,action) =>{
            state.activity=action.payload;
        }
    },
});

export const { getProfile, getActivity } = ProfileSlice.actions;
export default ProfileSlice.reducer;
