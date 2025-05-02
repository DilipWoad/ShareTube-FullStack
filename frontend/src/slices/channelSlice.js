import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    info: null,
    videos: null,
    posts: null,
  },
  reducers: {
    addChannelInfo: (state, action) => {
      state.info = action.payload;
    },
    addChannelVideos: (state, action) => {
      state.videos = action.payload;
    },
    addChannelPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export default channelSlice.reducer;
export const { addChannelInfo, addChannelPosts, addChannelVideos } =
  channelSlice.actions;
