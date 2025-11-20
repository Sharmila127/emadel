import { createSlice } from '@reduxjs/toolkit';

const InstitutesSlice = createSlice({
	name: 'InstitutesSlice',
	initialState: {
		institutes: [],
	},
	reducers: {
		getInstitutes: (state, action) => {
			state.institutes = action.payload;
		},
	},
});

export const { getInstitutes } = InstitutesSlice.actions;
export default InstitutesSlice.reducer;
