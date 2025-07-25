import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage";

import userReducer from "../slices/userSlice";
import videoReducer from "../slices/videoSlice";
import commentReducer from "../slices/commentSlice";
import libraryReducer from "../slices/librarySlice";
import playlistReducer from "../slices/playlistSlice";
import channelReducer from "../slices/channelSlice";
import postReducer from "../slices/postSlice";
import studioReducer from "../slices/studioSlice";
import toastCardReducer from "../slices/toastCardSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user","library"], // Only persist the required reducers
};

const rootReducer = combineReducers({
  user: userReducer,
  video: videoReducer,
  comment: commentReducer,
  library: libraryReducer,
  playlist: playlistReducer,
  channel: channelReducer,
  post : postReducer,
  studio:studioReducer,
  toast:toastCardReducer,
});

const presistedReducer = persistReducer(persistConfig,rootReducer)
const appStore = configureStore({
  reducer: presistedReducer,
});
export const persistor = persistStore(appStore);
export default appStore;
