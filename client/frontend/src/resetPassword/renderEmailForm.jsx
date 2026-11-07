import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {EmailForm} from "./emailForm.jsx";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <EmailForm/>
    </StrictMode>
)