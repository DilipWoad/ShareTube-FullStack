import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: [],
  reducers: {
    addVideoComments: (state, action) => {
      //first make them reverse
      return [...action.payload];
    },
    addNewComment: (state, action) => {
      state.unshift(action.payload);
    },
    removeVideoComments: (state, action) => {
      return null;
    },
    removeUserComment: (state, action) => {
      return state.filter(
        (comment) => comment._id !== action.payload //here will be id
      );
    },
    updateUserComment: (state, action) => {
      return state.map((comment) =>
        comment._id === action.payload._id ? action.payload : comment
      );
    },
  },
});

export default commentSlice.reducer;
export const {
  addNewComment,
  addVideoComments,
  removeVideoComments,
  removeUserComment,
  updateUserComment,
} = commentSlice.actions;
