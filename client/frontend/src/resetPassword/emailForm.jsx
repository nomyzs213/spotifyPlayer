import "../../styles/general.css";
import "./reset.css";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";

export const EmailForm = () => {
    return(
        <>
            <TopMenu/>
            <main>
                <h1>FORGOT PASSWORD?</h1>
               <label>your email<input type={"email"} placeholder={"email associated with your account..."} className={"basic-input"} name={"email-input"}/> </label>
                <button className={"reset-btn"}>SEND RESET CODE</button>
            </main>
        </>
    )
}

const ResetCode = () => {

}