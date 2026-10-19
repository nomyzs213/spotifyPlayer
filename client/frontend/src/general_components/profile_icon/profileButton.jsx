import "./profile-icon.css";
import "../../../../styles/general.css"

import {useState} from "react";

export const ProfileButton = ({username, src}) => {
    return(
        <>
            <div className={"user-icon-container"}>
                <h3>{username}</h3>
                <img src={src} alt={"user-icon"} className={"user-icon-img"}/>
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