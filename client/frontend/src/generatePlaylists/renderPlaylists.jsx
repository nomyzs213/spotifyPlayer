import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {Playlists} from "./playlists.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Playlists/>
    </StrictMode>
)