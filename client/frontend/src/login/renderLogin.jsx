import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {LoginPage} from "./login.jsx";
import "../../styles/general.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <LoginPage />
    </StrictMode>
)
