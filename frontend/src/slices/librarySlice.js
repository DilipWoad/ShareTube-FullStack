import { createSlice } from "@reduxjs/toolkit";

const librarySlice = createSlice({
  name: "library",
  initialState: {
    history: null,
    likeVideos: null,
    playlist: [],
  },
  reducers: {
    //watch history
    addUserHistory: (state, action) => {
      state.history = action.payload.reverse();
    },
    removeUserHistory:(state,action)=>{
      state.history = null
    },
    //liked videos

    addUserLikedVideos: (state, action) => {
      state.likeVideos = action.payload;
    },
    removeUserLikeVideos:(state,action)=>{
      state.likeVideos = null
    },

    //playlist
    addUserPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    addVideoToAPlaylist :(state,action)=>{
      state.playlist.unshift(action.payload)
    },
    removeUserPlaylist:(state,action)=>{
      state.playlist = null
    },
    addCreatedPlaylist:(state,action)=>{
      if(!state.playlist){
        state.playlist = action.payload;
      }else{
        state.playlist.unshift(action.payload);
      }
    },
    deletePlaylist: (state, action) => {
      state.playlist = state.playlist.filter(
        (playlist) => playlist._id !== action.payload
      );
    },
    editPlaylistInfo:(state,action)=>{
      const editingPlaylist = state.playlist.find((playlist)=>playlist._id === action.payload.id);
      console.log("sliceEditply",editingPlaylist);
      if(editingPlaylist){
        editingPlaylist.title = action.payload.title;
        editingPlaylist.description = action.payload.description;
      }
    }
  }
});

export default librarySlice.reducer;
export const {
  addUserHistory,
  addUserLikedVideos,
  addUserPlaylist,
  deletePlaylist,
  editPlaylistInfo,
  addCreatedPlaylist,
  removeUserHistory,
  removeUserPlaylist,
  removeUserLikeVideos,
  addVideoToAPlaylist

} = librarySlice.actions;
