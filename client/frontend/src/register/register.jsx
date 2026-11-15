import "../../styles/general.css";
import "../login/login-page.css";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import {useEffect, useRef, useState} from "react";
import {useRedirectLoggedInUser} from "../../custom_hooks/sessionData.js";

export const Register = () => {

    const [errorMessage, setMessage] = useState(null);
    const [isLoading] = useRedirectLoggedInUser();

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);



    const throwOrRegister = async () => {
        setMessage(null);

        if(!email || !password || !confirmPassword) {
            setMessage("please enter your credentials");
        }

        setEmail(email.replaceAll(" " , "").toLowerCase());
        setPassword(password.replaceAll(" " , ""));
        setConfirmPassword(confirmPassword.replaceAll(" " , ""));


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
            return;
        }

        await register(email, password, confirmPassword)
    }

    const register = async (email, password, confirmPassword) => {

        const response = await register("/api/register" , {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            })
        })
        if(response.status === 200){
            window.location.href = "/htmls/dashboard.html"
            return;
        }

        window.location.href = "/htmls/register.html"
        const data = await response.json();
        console.log(data);
    }

    return (

        <>
            <TopMenu/>
            <main>
                <p hidden={!isLoading} className={"loading"}>LOADING...</p>
                {!isLoading && <section className={"form-section"}>
                    <h1>Register</h1>

                    <label> email  <input
                        type={"email"}
                        className={"basic-input"}
                        id={"email-input"}
                        placeholder={"username..."}
                        name={"email"}
                        autoComplete={"email"}
                        ref={emailRef}
                        onInput={() => setEmail(emailRef.current.value)}/>
                    </label>

                    <label> password
                        <input
                            type={"password"}
                            placeholder={"password..."}
                            className={"basic-input"}
                            id={"password-input"}
                            name={"password"}
                            autoComplete={"off"}
                            ref={passwordRef}
                            onInput={() => setPassword(passwordRef.current.value)}/>
                    </label>

                    <label> confirm password
                        <input
                            type={"password"}
                            placeholder={"confirm password..."}
                            className={"basic-input"}
                            name={"confirm-password"}
                            autoComplete={"off"}
                            ref={confirmPasswordRef}
                            onInput={() => setConfirmPassword(confirmPasswordRef.current.value)}
                        />
                    </label>
                    <div className={"send-fetch-container"}>
                        <button className={"register-btn"} onClick={() => throwOrRegister()}> register </button>
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                    <a href={"/htmls/login.html"} className={"auth-redirect"}>already registered? </a>
                </section>}
            </main>
        </>
    )
}