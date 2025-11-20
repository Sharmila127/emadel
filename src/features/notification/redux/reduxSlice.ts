import { createSlice } from "@reduxjs/toolkit";

const ModuleSlice = createSlice({
  name: "Notification",
  initialState: {
    notification: [],
    branch:[],
    institute:[],
   resend:[]
    
  },
  reducers: {
    getNotification: (state, action) => {
      state.notification= action.payload;
    },

    creatNotification: (state, action) => {
      state.notification= action.payload;
    },

     getBranch: (state, action) => {
      state.branch= action.payload;
    },

    getInstitute: (state, action) => {
      state.institute= action.payload;
    },

    resend: (state, action) => {
      state.resend= action.payload;
    },
 

  },
});
export const {
  getNotification,getBranch,getInstitute,creatNotification,resend
} = ModuleSlice.actions;
export default ModuleSlice.reducer;
