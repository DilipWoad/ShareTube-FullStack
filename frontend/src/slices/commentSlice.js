import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: [],
  reducers: {
    addComments: (state, action) => {
      //first make them reverse
      return [...action.payload];
    },
    addNewComment: (state, action) => {
      state.unshift(action.payload);
    },
    removeComment: (state, action) => {
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
    addUserLikedStatus:(state, action)=>{
      
    }
  },
});

export default commentSlice.reducer;
export const {
  addNewComment,
  addComments,
  removeComment,
  removeUserComment,
  updateUserComment,
} = commentSlice.actions;
