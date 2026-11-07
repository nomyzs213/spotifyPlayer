import "./profile-icon.css";
import "../../../styles/general.css";

import {useState} from "react";

export const ProfileButton = ({username, src, isLoading, loggedIn}) => {
    return(
        <>
            {!isLoading && loggedIn &&
                <li className={"user-icon-container"}>
                <h3>{username}</h3>
                <img src={src} alt={"user-icon"} className={"user-icon-img"} loading={"lazy"}/>
            </li>
            }

            {!isLoading && !loggedIn &&
                <li className={"logged-out"}>
                <h3><a href={"./login.html"}>LOGIN/REGISTER</a></h3>
            </li>
            }

            {isLoading &&
                <li className={"smaller-loading"}>
                <p>loading...</p>
            </li>
            }
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