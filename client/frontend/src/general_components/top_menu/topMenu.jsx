import "./top-menu.css";
import "../../../styles/general.css"
import {ProfileButton} from "../profile_icon/profileButton.jsx";
import {useGetUserData} from "../../../custom_hooks/sessionData.js";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useState} from "react";

export const TopMenu = () => {
    let [isLoading, userData] = useGetUserData();
    const isPhone = useMediaQuery("screen only and (max-width : 768px)");
    const [burgerData , setBurger] = useState(null);
    if(!userData) userData = [null , null];

    const [display_name, imageUrl] = userData;

    const displayBurger = () => {
        if(burgerData === null)
            setBurger(() =>
                () => <MenuFragment isPhone={isPhone} displayName={display_name} imageUrl={imageUrl} isLoading={isLoading}/>);
    }

    const hideBurger = () => {
        if(burgerData !== null) setBurger(null);
    }
    return (
        <>
        {!isPhone && <ul className={"top-menu"} >
            <li className={"buttons-container"}>
                <MenuFragment isPhone={isPhone}/>
            </li>

                {!isPhone && <ProfileButton
                    username={display_name ? display_name : " "}
                    src={imageUrl ? imageUrl : ""}
                    isLoading={isLoading}
                    loggedIn={!!display_name}/>}
        </ul>}
            {isPhone && <a className={"burger-menu"} onMouseOver={} > </a>}
        </>
    );

}

const MenuFragment = ({isPhone , displayName, imageUrl , isLoading}) => {
    return (
        <>
            <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href="/htmls/index.html">HOME</a></div>
            <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href="/htmls/dashboard.html">LISTENING STATS</a></div>
             <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href="/htmls/playlists.html">PLAYLIST GENERATION</a></div>
             <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href="/htmls/playback.html">PLAYBACK</a></div>
            <SimplifiedProfile imageUrl={imageUrl} displayName={displayName}/>
        </>
    )
}

const SimplifiedProfile = ({imageUrl , displayName}) => {
    return (
        <>
            <div className={"img-box"}>
                <div className={"profile-box"}>
                    <img  src={imageUrl} alt={"profile image"}/>
                    <p>{displayName}</p>
                </div>
                <a href={"settings"}>SETTINGS</a>
            </div>
          <a href={"/api/logout"}> LOGOUT</a>
        </>
    )
}