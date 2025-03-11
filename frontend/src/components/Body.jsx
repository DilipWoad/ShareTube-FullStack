import { Outlet } from "react-router";
import Header from "./Header";

const Body =()=>{
    return(
        <div>
            <Header/>
            <Outlet/>
            <h1>Footer</h1>
        </div>
    )
}

export default Body;