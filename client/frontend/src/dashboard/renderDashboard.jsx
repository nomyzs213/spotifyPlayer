import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {Dashboard} from "./dashboard.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Dashboard/>
    </StrictMode>
)