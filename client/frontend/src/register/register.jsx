import "../../styles/general.css";
import "../login/login-page.css";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import {useState} from "react";
import {useRedirectLoggedInUser} from "../../custom_hooks/sessionData.js";

export const Register = () => {

    const [errorMessage, setMessage] = useState(null);
    const [isLoading] = useRedirectLoggedInUser();

    const throwOrRegister = () => {
        const email = document.getElementById("email-input").value.replaceAll(" ");
        const password = document.getElementById("password-input").value.replaceAll(" ");
        const confirmPassword = document.getElementById("confirm-password-input").value.replaceAll(" ");

        if(!email || !password || !confirmPassword) {
            setMessage("please enter your credentials");
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

        if( password !== confirmPassword) {
            setMessage("password confirmation does not match the password");
        }
    }

    const register = async (email, username, password, confirmPassword) => {
        const registrationData = {
            email,
            username,
            password,
            confirmPassword
        };
        
        window.location.href = "/api/register?registrationData";
        const response = await fetch("/api/getBindingStatus");

        if(response.status === 200){
            const path = "dashboard.html"
            window.location.href=`/api/redirect?path=${path}`;
            return;
        }
        setMessage(`problem with Spotify api}`);
        window.location.href="/register";
    }
    return (
        <>
            <TopMenu/>
            <main>
                <p hidden={!isLoading} className={"loading"}>LOADING...</p>
                <section className={"form-section"} hidden={isLoading}>
                    <h1>Register</h1>
                    <label> email  <input type={"text"} className={"basic-input"} id={"email-input"} placeholder={"username..."}/>  </label>
                    <label> password <input type={"password"} placeholder={"password..."} className={"basic-input"} id={"password-input"}/>  </label>
                    <label> confirm password<input type={"password"} placeholder={"confirm password..."} className={"basic-input"}/>  </label>
                    <div className={"send-fetch-container"}>
                        <button className={"login-btn"} > register </button>
                        <p hidden={!errorMessage && !isLoading}>{errorMessage}</p>
                    </div>
                    <a href={"/htmls/login.html"} className={"auth-redirect"}>already registered? </a>
                </section>
            </main>
        </>
    )
}