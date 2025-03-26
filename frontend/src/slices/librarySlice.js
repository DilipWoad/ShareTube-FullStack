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
  addCreatedPlaylist
} = librarySlice.actions;
