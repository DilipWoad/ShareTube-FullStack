import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name:"video",
    initialState:null,
    reducers:{
        addVideo:(state,action)=>{
            return action.payload
        }
    }
})

export default videoSlice.reducer;
export const{addVideo} = videoSlice.actions;