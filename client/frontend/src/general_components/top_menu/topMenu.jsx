import "./top-menu.css";
import "../../../styles/general.css"
import {ProfileButton} from "../profile_icon/profileButton.jsx";
export const TopMenu = ({username, profileImgSrc, isLoading, loggedIn}) => {

    return (
        <>
        <ul className={"top-menu"} >
            <div className={"buttons-container"} >
                    <li className="top-menu-item"><a href="/htmls/index.html">HOME</a></li>
                    <li className="top-menu-item"><a href="/htmls/dashboard.html">LISTENING STATS</a></li>
                    <li className="top-menu-item"><a href="/htmls/playlists.html">PLAYLIST GENERATION</a></li>
                    <li className="top-menu-item"><a href="/htmls/playback.html">PLAYBACK</a></li>
            </div>
            <ProfileButton  username={username} src={profileImgSrc} isLoading={isLoading} loggedIn={loggedIn}/>
        </ul>
        </>
    );

}