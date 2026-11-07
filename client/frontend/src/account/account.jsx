import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./account.css";

export const Account = () => {
    return (
        <>
            <TopMenu/>
            <main>
                <div className={"change-box"}>
                    <h2>Change password</h2>
                    <label> current password<input type={"password"} className={"basic-input"} name={"password"}/> </label>
                    <label> new password<input type={"password"} className={"basic-input"} name={"new-password"}/> </label>
                    <button className={"reset-btn"}>RESET PASSWORD</button>
                </div>
                <div className={"change-box"}>
                    <h2>Change email</h2>
                   <label> current email<input type={"email"} className={"basic-input"} name={"email"}/></label>
                    <label> new email <input type={"email"} className={"basic-input"} name={"new-email"}/></label>
                    <button className={"reset-btn"}>RESET EMAIL</button>
                </div>

            </main>
        </>
);
}