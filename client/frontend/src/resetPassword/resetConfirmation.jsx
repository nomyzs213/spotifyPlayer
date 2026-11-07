import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./reset.css";

export const ResetConfirmation = () => {
    return(
        <>
            <TopMenu/>
            <main>
                <h1>Confirm password reset</h1>
                <label> new password <input type={"password"} className={"basic-input"} placeholder={"your new password..."} name={"password"}/> </label>
                <label> confirm password <input type={"password"} className={"basic-input"} placeholder={"type your password again..."} name={"confirm-password"}/> </label>
                <button className={"reset-btn"}>CONFIRM RESET</button>
            </main>
        </>
    )
}