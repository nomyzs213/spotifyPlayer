import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {ResetConfirmation} from "./resetConfirmation.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ResetConfirmation/>
    </StrictMode>
)