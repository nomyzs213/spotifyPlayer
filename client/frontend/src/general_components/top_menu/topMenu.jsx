import "./top-menu.css";
import "../../../styles/general.css"
import {ProfileButton} from "../profile_icon/profileButton.jsx";
export const TopMenu = ({username, profileImgSrc}) => {

    return (
        <>
        <ul className={"top-menu"}>
            <div className={"buttons-container"} >
                    <li className="top-menu-item"><a href="/">HOME</a></li>
                    <li className="top-menu-item"><a href="/stats">LISTENING STATS</a></li>
                    <li className="top-menu-item"><a href="/playlists">PLAYLIST GENERATION</a></li>
                    <li className="top-menu-item"><a href="/playback">PLAYBACK</a></li>
            </div>
            <ProfileButton  username={username} src={profileImgSrc}/>
        </ul>
        </>
    );

}