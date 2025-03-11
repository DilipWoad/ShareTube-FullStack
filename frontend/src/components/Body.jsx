import { Outlet } from "react-router";
import Header from "./Header";

const Body =()=>{
    return(
        <div>
       
            <Outlet/>
        </div>
    )
}

export default Body;