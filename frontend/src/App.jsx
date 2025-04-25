import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginComponent from "./components/AuthsComponents/LoginComponent";
import SignupComponent from "./components/AuthsComponents/SignupComponent";
import VideoFeed from "./components/VideoComponents/VideoFeed";
import { Provider } from "react-redux";
import appStore, { persistor } from "./utils/appStore";
import SingleVideo from "./components/VideoComponents/SingleVideo";
import UserLibrary from "./components/LibraryComponents/UserLibrary";
import Playlist from "./components/PlaylistComponents/Playlist";
import { PersistGate } from "redux-persist/integration/react";
import UploadVideo from "./components/VideoComponents/UploadVideo";
import ChannelPage from "./components/ChannelComponents/ChannelPage";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/" element={<VideoFeed />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/signup" element={<SignupComponent />} />
                <Route path="/watch" element={<SingleVideo />} />
                <Route path="/you" element={<UserLibrary />} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/upload/video" element={<UploadVideo />} />
                {/* <Route path="/subscription" element={<UserSubscription/>}/> */}
                <Route path="/channel/:id" element={<ChannelPage />} />
                <Route path="/channel/:id/videos" element={<ChannelPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
