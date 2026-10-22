import "./profile-icon.css";
import "../../../styles/general.css"

import {useState} from "react";

export const ProfileButton = ({username, src, isLoading, loggedIn}) => {
    return(
        <>
            <div className={"user-icon-container"} hidden={isLoading || !loggedIn}>
                <h3>{username}</h3>
                <img src={src} alt={"user-icon"} className={"user-icon-img"}/>
            </div>

            <div className={"logged-out"} hidden={isLoading || loggedIn}>
                <h3><a href={"./login.html"}></a></h3>
            </div>

            <div className={"smaller-loading"} hidden={!isLoading}>
                <p>loading...</p>
            </div>
        </>
    )
}

const ProfileMenu = () => {
    return (
        <>
            <div className={"user-profile-menu"}>
                <button className={"settings-btn"}> <a href={"/settings"}> settings </a> </button>
                <button className={"logout-btn"}><a href={"/api/logout"}> logout</a></button>
            </div>

        </>
    )
}