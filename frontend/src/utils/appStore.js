import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import videoReducer from "../slices/videoSlice";
const appStore = configureStore({
    reducer:{
        user : userReducer,
        video : videoReducer
    },
})

export default appStore;