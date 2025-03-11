import Body from "./components/Body";
import {BrowserRouter, Route, Routes} from "react-router";
import LoginComponent from "./components/LoginComponent";
import SignupComponent from "./components/SignupComponent";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path="/login" element={<LoginComponent/>}/>
            <Route path="/signup" element={<SignupComponent/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
