import { createSlice } from "@reduxjs/toolkit";
const studioSlice = createSlice({
  name: "studio",
  initialState: {
    videos: null,
    dashboard: null,
  },
  reducers: {
    addVideoInStudio: (state, action) => {
      //first make them reverse
      state.videos = action.payload;
    },
    addDashboard: (state, action) => {
      state.dashboard = action.payload;
    },
    editVideoInfo: (state, action) => {
      const editingVideoObj = state.videos.find(
        (video) => video._id === action.payload._id
      );
      //if exist
      if (editingVideoObj) {
        editingVideoObj.title = action.payload.title;
        editingVideoObj.description = action.payload.description;
        editingVideoObj.thumbnail = action.payload.thumbnail;
      }
    },
    togglePublished: (state, action) => {
      const publishingVideoObj = state.videos.find(
        (video) => video._id === action.payload
      );
      if (publishingVideoObj) {
        publishingVideoObj.isPublished = !publishingVideoObj.isPublished;
      }
    },
    addNewVideo: (state, action) => {
      state.videos.unshift(action.payload);
    },
  },
});

export default studioSlice.reducer;
export const {
  addVideoInStudio,
  addDashboard,
  editVideoInfo,
  togglePublished,
  addNewVideo,
} = studioSlice.actions;
