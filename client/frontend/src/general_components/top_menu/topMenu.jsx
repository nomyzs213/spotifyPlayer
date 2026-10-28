import "./top-menu.css";
import "../../../styles/general.css"
import {ProfileButton} from "../profile_icon/profileButton.jsx";
import {useGetUserData} from "../../../custom_hooks/sessionData.js";
export const TopMenu = () => {
    let [isLoading, userData] = useGetUserData();
    if(!userData) userData = [null , null];

    const [display_name, imageUrl] = userData;
    return (
        <>
        <ul className={"top-menu"} >
            <div className={"buttons-container"} >
                    <li className="top-menu-item"><a href="/htmls/index.html">HOME</a></li>
                    <li className="top-menu-item"><a href="/htmls/dashboard.html">LISTENING STATS</a></li>
                    <li className="top-menu-item"><a href="/htmls/playlists.html">PLAYLIST GENERATION</a></li>
                    <li className="top-menu-item"><a href="/htmls/playback.html">PLAYBACK</a></li>
            </div>
            <ProfileButton
                username={display_name ? display_name : " "}
                src={imageUrl ? imageUrl : ""}
                isLoading={isLoading}
                loggedIn={!!display_name}/>
        </ul>
        </>
    );

}