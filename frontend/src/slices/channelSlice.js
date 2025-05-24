import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    info: null,
    videos: null,
  },
  reducers: {
    addChannelInfo: (state, action) => {
      state.info = action.payload;
    },
    addChannelVideos: (state, action) => {
      state.videos = action.payload;
    },
  },
});

export default channelSlice.reducer;
export const {
  addChannelInfo,
  addChannelVideos,
} = channelSlice.actions;
