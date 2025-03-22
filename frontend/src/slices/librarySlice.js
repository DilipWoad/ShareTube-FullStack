import { createSlice } from "@reduxjs/toolkit";

const librarySlice = createSlice({
    name:"library",
    initialState:{
        history:null,
        likeVideos:null,
        playlist:null
    },
    reducers:{
        addUserHistory:(state,action)=>{
            state.history = action.payload
        },
        addUserLikedVideos:(state,action)=>{
            state.likeVideos = action.payload
        },
        addUserPlaylist:(state,action)=>{
            state.playlist = action.payload
        },
        
    }
})

export default librarySlice.reducer;
export const{addUserHistory,addUserLikedVideos,addUserPlaylist} = librarySlice.actions