import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      return null;
    },
    updateUser: (state, action) => {
      if (state) {
        return {
          ...state,
          ...action.payload,
        };
      }
      return state;
    },
    updateAvatarImg: (state, action) => {
      state.avatar = action.payload;
    },
    updateCoverImg: (state, action) => {
      state.coverImage = action.payload;
    },
    
  },
});

export default userSlice.reducer;
export const {
  addUser,
  removeUser,
  updateUser,
  updateAvatarImg,
  updateCoverImg,
} = userSlice.actions;
