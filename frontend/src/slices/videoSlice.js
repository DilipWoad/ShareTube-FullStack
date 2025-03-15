import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name:"video",
    initialState:[],
    reducers:{
        addVideo:(state,action)=>{
            return [...action.payload]
        },
        removeVideoFeed:(state,action)=>{
            return null;
        }
    }
})

export default videoSlice.reducer;
export const{addVideo,removeVideoFeed} = videoSlice.actions;