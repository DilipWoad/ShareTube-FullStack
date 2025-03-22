import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router";
import LoginComponent from "./components/LoginComponent";
import SignupComponent from "./components/SignupComponent";
import VideoFeed from "./components/VideoFeed";
import {Provider} from "react-redux";
import appStore from "./utils/appStore";
import SingleVideo from "./components/SingleVideo";
import UserLibrary from "./components/UserLibrary";
import Playlist from "./components/Playlist";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<VideoFeed/>}/>
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/signup" element={<SignupComponent />} />
              <Route path="/watch" element={<SingleVideo/>}/>
              <Route path="/you" element={<UserLibrary/>}/>
              <Route path="/playlist" element={<Playlist/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
