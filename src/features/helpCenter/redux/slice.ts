/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit'

const data: any[] = []

const helpcenter = createSlice({
    name: "helpcenter",
    initialState: {
        getAll: data
    },
    reducers: {
        UpdateAndAddHelp: (state, action) => {
            const play = action.payload
            const index = state.getAll.findIndex((item: any) => item?.uuid == play?.uuid)
            if (index < 0) {
                state.getAll[index] = play
            } else {
                state.getAll.push(play)
            }
        },
        getAllHelp: (state, action) => {
            state.getAll = action.payload
        }
    }
})

export const { UpdateAndAddHelp, getAllHelp } = helpcenter.actions

export default helpcenter.reducer