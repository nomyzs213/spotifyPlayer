import {useState} from "react";
import "./login-page.css";
import "../../styles/general.css";

export const LoginPage = () => {

    let [errorMessage, setMessage] = useState(null);

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
            <section className={"form-section"}>
                <h1>Log in</h1>
                <label> email or username <input type={"text"} className={"basic-input"} id={"email-input"} placeholder={"username..."}/>  </label>
                <label> password <input type={"password"} placeholder={"password..."} className={"basic-input"} id={"password-input"}/>  </label>

                <div className={"send-fetch-container"}>
                    <button onClick={() => throwOrLogin()} className={"login-btn"} > log in</button>
                    <p hidden={!errorMessage}></p>
                </div>
            </section>
        </>
    )


}

