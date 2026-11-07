import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {Register} from "./register.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Register/>
    </StrictMode>
);
