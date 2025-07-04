import { createSlice } from "@reduxjs/toolkit";

const librarySlice = createSlice({
  name: "library",
  initialState: {
    history: null,
    likeVideos: null,
    playlist: [],
  },
  reducers: {
    addUserHistory: (state, action) => {
      state.history = action.payload.reverse();
    },
    removeUserHistory:(state,action)=>{
      state.history = null
    },
    addUserLikedVideos: (state, action) => {
      state.likeVideos = action.payload;
    },
    removeUserLikeVideos:(state,action)=>{
      state.likeVideos = null
    },
    addUserPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    addVideoToPlaylist :(state,action)=>{
      state.playlist.push(action.payload)
    },
    removeUserPlaylist:(state,action)=>{
      state.playlist = null
    },
    addCreatedPlaylist:(state,action)=>{
      state.playlist.push(action.payload);
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
  addVideoToPlaylist

} = librarySlice.actions;
