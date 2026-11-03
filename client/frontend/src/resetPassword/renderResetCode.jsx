import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {ResetCode} from "./resetCode.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ResetCode/>
    </StrictMode>
)