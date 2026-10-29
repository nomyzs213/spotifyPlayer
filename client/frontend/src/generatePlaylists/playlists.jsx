import {useGetDataOrRedirect, useRedirectLoggedOutUser} from "../../custom_hooks/sessionData.js";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playlists.css";
import {testPlaylists} from "../playback/testData.js";
import {useRef, useState} from "react";

export const Playlists = () => {
    const [isLoading, userData] = useGetDataOrRedirect();
    const [selected, setSelected] =useState(null);
    const moods = ["energetic" , "chill" , "sad" , "happy"];

    return(
        <>
            <TopMenu/>
            <main>
                <section>
                    <h2>Select playlist</h2>
                    <div className={"playlist-box"}>
                        {testPlaylists.map(p => <Playlist item={p} key={p.id} id={p.id} onClick={setSelected(p.id)} selected={selected}/>)}
                    </div>
                </section>

                <section className={`creation-menu`}>
                    <label>UNIQUE playlist name<input type={"text"} placeholder={"playlist name..."}/></label>
                    <label>select mood <select>
                        {moods.map(m => <option key={m}>{m}</option>)}
                    </select></label>
                    <button className={"action-btn"}>GENERATE PLAYLIST</button>
                </section>
            </main>
        </>
    )
}

function Playlist({item, selected}){
    return (
        <section className={"playlist"}>

            <div className={selected ? "selected-playlist" : "img-box"}>
                <img src={item.src} alt={"playlist img"}/>
            </div>
            <h3>{item.title}</h3>
        </section>
    );
}