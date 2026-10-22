import {useState ,useEffect} from "react";
import "./login-page.css";
import "../../styles/general.css";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import {spotifyFetchSchema} from "../../../../server/utlils/spotifyFetchSchema.js";
import {useRedirectLoggedInUser} from "../../custom_hooks/sessionData.js";

export const LoginPage = () => {

    const [errorMessage, setMessage] = useState(null);
    const [isLoading] = useRedirectLoggedInUser();

    const throwOrLogin = async () => {
        const email = document.getElementById("email-input").value.replaceAll(" ");
        const password = document.getElementById("password-input").value.replaceAll(" ");
        if(!email || !password) {
            setMessage("please enter your credentials");
            return;
        }

        if(password.length < 8) {
            setMessage("password is to short.Please enter at least 8 characters.");
            return;
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regex.test(email)){
            setMessage("please enter a valid email address");
            return;
        }

        await login(email, password)
    }

        async function login(username ,password){
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        let data;
        if(response.status === 400){
            data = await response.json();
        }

        setMessage(data?.message ? data?.message : false);

    }


    return(
        <>
            <p hidden={isLoading} className={"loading"}>LOADING...</p>
            <section className={"form-section"} hidden={!isLoading}>
                <h1>Log in</h1>
                <label> email  <input type={"text"} className={"basic-input"} id={"email-input"} placeholder={"username..."}/>  </label>
                <label> password <input type={"password"} placeholder={"password..."} className={"basic-input"} id={"password-input"}/>  </label>

                <div className={"send-fetch-container"}>
                    <button onClick={() => throwOrLogin()} className={"login-btn"} > log in</button>
                    <p hidden={!errorMessage}>{errorMessage}</p>
                </div>
            </section>
        </>
    )


}

