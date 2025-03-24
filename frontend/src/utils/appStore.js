import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import videoReducer from "../slices/videoSlice";
import commentReducer from "../slices/commentSlice";
import libraryReducer from "../slices/librarySlice";
import playlistReducer from "../slices/playlistSlice";
const appStore = configureStore({
    reducer:{
        user : userReducer,
        video : videoReducer,
        comment : commentReducer,
        library : libraryReducer,
        playlist: playlistReducer,
    },
})

export default appStore;