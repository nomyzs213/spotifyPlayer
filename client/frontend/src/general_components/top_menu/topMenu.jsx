import "./style.css";
import {ProfileButton} from "../profile_icon/profileButton.jsx";
export const TopMenu = (profileImgSrc) => {

    return (
        <>
        <ul className={"top-menu"}>
            <div className={"buttons-container"} >
                    <li className="top-menu-item"><a href="/">main site</a></li>
                    <li className="top-menu-item"><a href="/stats">listening stats</a></li>
                    <li className="top-menu-item"><a href="/playlists">playlist generation</a></li>
                    <li className="top-menu-item"><a href="/playback">playback</a></li>
            </div>
            <ProfileButton src = {profileImgSrc}/>
        </ul>
        </>
    );

}