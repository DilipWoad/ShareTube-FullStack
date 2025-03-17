import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name:"video",
    initialState:{
        feeds:[],
        isMenuClicked:false
    },
    reducers:{
        addVideo:(state,action)=>{
            state.feeds=[...action.payload];
        },
        removeVideoFeed:(state,action)=>{
            return null;
        },
        toggleMenuClick:(state,action)=>{
        state.isMenuClicked= !state.isMenuClicked
        }
    }
})

export default videoSlice.reducer;
export const{addVideo,removeVideoFeed,toggleMenuClick} = videoSlice.actions;