import { createSlice } from "@reduxjs/toolkit"

const dashboard = createSlice({
    name: "dashboard",
    initialState: {
        data: []
    },
    reducers: {
        setDashboardData: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setDashboardData } = dashboard.actions
export default dashboard.reducer