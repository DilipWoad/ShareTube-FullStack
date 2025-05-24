import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: [],
  reducers: {
    addPost: (state, action) => {
      //first make them reverse
      return [...action.payload];
    },
    addNewPost: (state, action) => {
      state.unshift(action.payload);
    },
    removePost: (state, action) => {
      return null;
    },
    removeUserPost: (state, action) => {
      return state.filter(
        (post) => post._id !== action.payload //here will be id
      );
    },
    updateUserPost: (state, action) => {
      return state.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
  },
});

export default postSlice.reducer;
export const {
  addPost,
  addNewPost,
  removePost,
  removeUserPost,
  updateUserPost,
} = postSlice.actions;
