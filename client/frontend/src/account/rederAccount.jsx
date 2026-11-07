import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {Account} from "./account.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Account/>
    </StrictMode>
)