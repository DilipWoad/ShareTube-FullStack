import { createSlice } from "@reduxjs/toolkit";

const librarySlice = createSlice({
  name: "library",
  initialState: {
    history: null,
    likeVideos: null,
    playlist: null,
  },
  reducers: {
    addUserHistory: (state, action) => {
      state.history = action.payload;
    },
    addUserLikedVideos: (state, action) => {
      state.likeVideos = action.payload;
    },
    addUserPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    deletePlaylist: (state, action) => {
      state.playlist = state.playlist.filter(
        (playlist) => playlist._id !== action.payload
      );
    },
    editPlaylistInfo : (state,action)=>{
      return state.playlist.map((playlist)=>{
        if(playlist._id === action.payload.id){
          playlist.title = action.payload.title
          playlist.description = action.payload.description
        }
      })
    }
  }
});

export default librarySlice.reducer;
export const {
  addUserHistory,
  addUserLikedVideos,
  addUserPlaylist,
  deletePlaylist,
  editPlaylistInfo
} = librarySlice.actions;
