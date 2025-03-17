import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: null,
  reducers: {
    addVideoComments: (state, action) => {
      //first make them reverse
      const reverseArray = action.payload;
      console.log(reverseArray);
      return reverseArray.reverse();
    },
    addNewComment: (state, action) => {
      const userComment = action.payload;
      state.unshift(userComment);
    },
    removeVideoComments: (state, action) => {
      return null;
    },
    removeUserComment: (state, action) => {
      return action.payload;
    },
  },
});

export default commentSlice.reducer;
export const {
  addNewComment,
  addVideoComments,
  removeVideoComments,
  removeUserComment,
} = commentSlice.actions;
