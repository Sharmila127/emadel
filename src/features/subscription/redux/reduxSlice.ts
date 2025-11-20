import { createSlice } from "@reduxjs/toolkit";

const ModuleSlice = createSlice({
  name: "Subscription",
  initialState: {
    subscription: [],
    
  },
  reducers: {
    getSubscription: (state, action) => {
      state.subscription= action.payload;
    },

    creatSubscription: (state, action) => {
      state.subscription= action.payload;
    },

     editSubscription: (state, action) => {
      state.subscription= action.payload;
    },

  },
});
export const {
 getSubscription,creatSubscription,editSubscription
} = ModuleSlice.actions;
export default ModuleSlice.reducer;
