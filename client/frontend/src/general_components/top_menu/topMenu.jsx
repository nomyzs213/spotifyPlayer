import "./top-menu.css";
import "../../../styles/general.css"
import {ProfileButton} from "../profile_icon/profileButton.jsx";
import {useGetUserData} from "../../../custom_hooks/sessionData.js";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useState} from "react";
import burgerMenu from "./burger-menu.svg";

export const TopMenu = () => {
    let [isLoading, userData] = useGetUserData();
    if(!userData) userData = [null , null];

    const isPhone = useMediaQuery("only screen and (max-width : 768px)");
    const [mouseOnMenu, setOnMenu] = useState(false);

    const [display_name, imageUrl] = userData;

    let timer;
    const hideWithTimeout = () => {
        timer = setTimeout(() => setOnMenu(false) , 350);
    }

    const cancelTimeout = () => {
        if(timer !== null) clearTimeout(timer);
    }
    return (
        <>
        {!isPhone && <ul className={"classic-menu"} >
            <li className={"buttons-container"}>
                <MenuFragment isPhone={isPhone}/>
            </li>

                {!isPhone && <ProfileButton
                    username={display_name ? display_name : " "}
                    src={imageUrl ? imageUrl : " "}
                    isLoading={isLoading}
                    loggedIn={!!display_name}/>}
        </ul>}

            {isPhone &&
                <div className={"burger-container"}>
                    <button
                        className={"burger-menu-button"}
                        onMouseEnter={() => { setOnMenu(true); cancelTimeout(); }}
                        onMouseLeave={() => hideWithTimeout()}
                        onClick={() => { setOnMenu(prevState => !prevState); cancelTimeout(); }}
                    >
                        <img src={burgerMenu} className={"burger-icon"} alt={"burger menu icon"} />
                    </button>

                    {mouseOnMenu && (
                        <div
                            className={"options-container"}
                            onMouseEnter={() => {setOnMenu(true); cancelTimeout(); } }
                            onMouseLeave={() => hideWithTimeout()}
                        >
                            <MenuFragment isPhone={isPhone} displayName={display_name} imageUrl={imageUrl}/>
                        </div>
                    )}
                </div>
            }
        </>
    );

}

const MenuFragment = ({isPhone , displayName, imageUrl}) => {
    return (
        <>
            <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href={"/htmls/index.html"}>HOME</a></div>
            <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href={"/htmls/dashboard.html"}>LISTENING STATS</a></div>
             <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href={"/htmls/playlists.html"}>PLAYLIST GENERATION</a></div>
             <div className={isPhone ? "burger-item"  :"top-menu-item"}><a href={"/htmls/playback.html"}>PLAYBACK</a></div>
            {isPhone && displayName && <SimplifiedProfile imageUrl={imageUrl} displayName={displayName}/>}
        </>
    )
}

const SimplifiedProfile = ({imageUrl , displayName}) => {
    return (
        <div className={"burger-item"}>
            <div className={"img-box"}>
                <div className={"profile-box"}>
                    <img  src={imageUrl} alt={"profile image"}/>
                    <p>{displayName}</p>
                </div>
                <a href={"/htmls/account.html"}>ACCOUNT</a>
            </div>
          <a href={"/api/logout"}> LOGOUT</a>
        </div>
    )
}


