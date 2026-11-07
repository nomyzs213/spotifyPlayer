import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./reset.css";

export const ResetCode = () => {
    return (
        <>
            <TopMenu/>
            <main>
                <label>type in your reset code <input type={"text"} minLength={6} maxLength={6} className={"basic-input"}/> </label>
                <button className={"reset-btn"}>VALIDATE CODE</button>
            </main>
        </>
    )
}