
import { createSlice } from '@reduxjs/toolkit'

const HelpcenterTicketSlice = createSlice({

    name: "helpcenterTicket",
    initialState : {
        data : [],
    },
  reducers : {
        getHelpcenterTicket : (state,action) => {
            state.data = action.payload;
        }
    }

})

export const {getHelpcenterTicket} = HelpcenterTicketSlice.actions;
export default HelpcenterTicketSlice.reducer;