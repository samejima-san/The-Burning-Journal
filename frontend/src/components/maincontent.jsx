import React from "react";
import { Outlet } from "react-router-dom";
import "../stylesheets/maincontent.css";


function Maincontent(){
    return(
        <div className="main-container">
            <Outlet />
        </div>
    )
}
export default Maincontent;