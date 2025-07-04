import { createSlice } from "@reduxjs/toolkit";

const playlistSlice = createSlice({
  name: "playlist",
  initialState: null,
  reducers: {
    addPlaylist: (state, action) => {
      return action.payload;
    },
    removeVideoFromPlaylist: (state, action) => {
      if (state && state.playlistVideos) {
        console.log("Before removing:", state.playlistVideos);
        state.playlistVideos = state.playlistVideos.filter(
          (video) => video._id !== action.payload
        );
        console.log("After removing:", state.playlistVideos.length);
      }
    },
    editPlaylist: (state, action) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
    },
  },
});

export default playlistSlice.reducer;
export const { addPlaylist, removeVideoFromPlaylist, editPlaylist } =
  playlistSlice.actions;
