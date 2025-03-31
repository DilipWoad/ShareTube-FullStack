import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
    name:"video",
    initialState:{
        feeds:null,
        isMenuClicked:false
    },
    reducers:{
        addVideo:(state,action)=>{
            state.feeds=action.payload.reverse();
        },
        removeVideoFeed:(state,action)=>{
            state.feeds = null
        },
        toggleMenuClick:(state,action)=>{
            state.isMenuClicked = !state.isMenuClicked;
            
        }
    }
})

export default videoSlice.reducer;
export const{addVideo,removeVideoFeed,toggleMenuClick} = videoSlice.actions;