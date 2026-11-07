import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {Playback} from "./playback.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Playback/>
    </StrictMode>
)