import "../../styles/general.css";
import "../login/login-page.css";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import {useRef, useState} from "react";
import {useRedirectLoggedInUser} from "../../custom_hooks/sessionData.js";

export const Register = () => {

    const [errorMessage, setMessage] = useState(null);
    const [isLoading] = useRedirectLoggedInUser();

    const [email, setEmail] = useState( " ");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState( "");

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);



    const throwOrRegister = async () => {
        setMessage(null);
        const cleanEmail = email.replaceAll(" " , "").toLowerCase();
        const cleanPassword = password.replaceAll(" " , "");
        const cleanConfirmPassword = confirmPassword.replaceAll(" " , "");


        if(!cleanEmail || !cleanPassword || !cleanConfirmPassword) {
            setMessage("please enter your credentials");
        }

        if(cleanPassword.length < 8) {
            setMessage("password is to short.Please enter at least 8 characters.");
            return;
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regex.test(cleanEmail)){
            setMessage("please enter a valid email address");
            return;
        }

        if( cleanPassword !== cleanConfirmPassword) {
            setMessage("password confirmation does not match the password");
            return;
        }

        await register(cleanEmail, cleanPassword, cleanConfirmPassword)
    }

    const register = async (email, password, confirmPassword) => {

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword,
                })
            });

            if(response.status !== 201){

                const data = await response.json();
                console.log(data);
                setMessage(`${data.error.status} : ${data.error.message}`);
                
                return;
            }
        }
        catch (err){
            console.log(err)
        }

        window.location.href = `/api/link-account?alreadyRegistered=${false}`;

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